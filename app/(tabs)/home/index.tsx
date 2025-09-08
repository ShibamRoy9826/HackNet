//components
import HomeHeader from "@components/containers/HomeHeader";
import Post from "@components/containers/post";
import { ActivityIndicator, Animated, KeyboardAvoidingView, ListRenderItem, ListRenderItemInfo, RefreshControl, View } from "react-native";

//others
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//react
import React, { useCallback, useEffect, useRef, useState } from "react";

//firebase
import { auth, db } from '@auth/firebase';
import { collection, getDocs, limit, orderBy, query, QueryDocumentSnapshot, startAfter } from 'firebase/firestore';

//typecasting
import { post } from "@utils/types";

const postLimit = 10;

export default function HomeScreen() {
    const insets = useSafeAreaInsets();

    //header animation
    const scrollY = useRef(new Animated.Value(0)).current;
    const diffClamp = Animated.diffClamp(scrollY, 0, 64 + insets.top);
    const translateY = diffClamp.interpolate({
        inputRange: [0, 50 + insets.top],
        outputRange: [0, -50 - insets.top],
    });

    const user = auth.currentUser;

    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState<post[]>([]);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
    const [endReached, setEndReached] = useState(false);

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setLastDoc(null);
        setEndReached(false);
        loadPosts();
        setTimeout(() => {
            setRefreshing(false);
        }, 500);
    }, []);


    const loadingRef = useRef(false);

    const renderPost: ListRenderItem<post> = useCallback(({ item }: ListRenderItemInfo<post>) =>
    (
        <Post comment_count={item.num_comments}
            user_uid={user ? user.uid : ""}
            id={item.id}
            uid={item.uid}
            timestamp={item.timestamp}
            message={item.post_message}
            used_media={item.used_media}
            media={item.media} />

    ), [user])

    async function fetchPosts(lastDoc: QueryDocumentSnapshot | null, userId: string) {
        let q = query(
            collection(db, "posts"),
            orderBy("timestamp", 'desc'),
            limit(postLimit),
            // where("uid","!=",userId) //TO CHANGE AFTER DEPLOYING
        );

        if (lastDoc) {
            q = query(q, startAfter(lastDoc));
        }

        const snap = await getDocs(q);

        const fetchedPosts: post[] = snap.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<post, 'id'>)
        }));

        return { fetchedPosts, lastDoc: snap.docs[snap.docs.length - 1] };

    }
    async function loadPosts() {
        console.log("Load posts ran", !loadingRef.current, !endReached);
        if (user && !loadingRef.current && !endReached) {
            loadingRef.current = true;
            if (loading || endReached) return;
            setLoading(true);
            console.log("set loading to true,fetching posts");

            fetchPosts(lastDoc, user.uid).then(
                ({ fetchedPosts: newPosts, lastDoc: newLastDoc }) => {
                    if (newPosts.length === 0) {
                        setEndReached(true);
                    } else {
                        console.log("setting new posts");
                        setPosts(prev => {
                            const ids = new Set(prev.map(p => p.id));
                            const onlyNew = newPosts.filter(p => !ids.has(p.id));
                            if (onlyNew.length === 0) return prev;
                            return [...prev, ...onlyNew];
                        });
                        setLastDoc(newLastDoc);
                    }
                }
            ).finally(() => {
                console.log("setting loading to false")
                loadingRef.current = false;
                setLoading(false);
            }).catch((e) => { console.log("couldn't fetch posts", e) });

        };
    }

    useEffect(() => {
        loadPosts();
    }, [])

    return (
        <KeyboardAvoidingView behavior={"height"} style={{ backgroundColor: "#17171d", paddingTop: insets.top, flex: 1, overflow: "hidden" }}>

            <HomeHeader tY={translateY} h={50 + insets.top} pT={insets.top} />

            <Animated.FlatList
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                data={posts}
                keyExtractor={item => item.id}
                renderItem={renderPost}
                style={{ backgroundColor: "#17171d", flex: 1, height: "100%" }}
                onScroll={e => {
                    scrollY.setValue(e.nativeEvent.contentOffset.y);
                }}
                onEndReached={loadPosts}
                onEndReachedThreshold={0.5}
                ListHeaderComponent={<View style={{ height: 50 + insets.top }}></View>}
                ListFooterComponent={<View style={{ padding: 100 }}>{loading ? <ActivityIndicator size="large" /> : null}</View>}
                removeClippedSubviews={true}
                windowSize={5}
                initialNumToRender={postLimit}
                maxToRenderPerBatch={postLimit}
            />

        </KeyboardAvoidingView>
    );
}

