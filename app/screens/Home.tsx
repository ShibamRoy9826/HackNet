import { RefreshControl, View, Animated, ActivityIndicator, Text } from "react-native";
import HomeHeader from "../components/HomeHeader";
import Post from "../components/post";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRef, useEffect, useState } from "react";
import { collection, query, limit, orderBy, getDocs, startAfter, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { auth, db } from '../auth/firebase';
import React from 'react';

const postLimit = 10;
interface post {
    id: string,
    uid: string,
    post_message: string,
    used_media: boolean,
    timestamp: Timestamp,
    media: string[]
}


export default function HomeScreen({ navigation }) {

    const insets = useSafeAreaInsets();
    // const scrollY = new Animated.Value(0);
    const scrollY = useRef(new Animated.Value(0)).current;
    const diffClamp = Animated.diffClamp(scrollY, 0, 64 + insets.top);

    const translateY = diffClamp.interpolate({
        inputRange: [0, 50 + insets.top],
        outputRange: [0, -50 - insets.top],
    });

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setLastDoc(null);
        setEndReached(false);
        setPosts([]);
        loadPosts();
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    const user = auth.currentUser;

    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState<post[]>([]);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
    const [endReached, setEndReached] = useState(false);

    const loadingRef = useRef(false);

    async function fetchPosts(lastDoc: QueryDocumentSnapshot | null, userId: string) {
        let q = query(
            collection(db, "posts"),
            // orderBy("uid"),
            orderBy("timestamp", 'asc'),
            limit(postLimit),
            // where("uid","!=",userId)
        );

        if (lastDoc) {
            q = query(q, startAfter(lastDoc));
        }

        const snap = await getDocs(q);

        // const posts=snap.docs.map(doc=>({id:doc.id,...doc.data()}))
        const fetchedPosts: post[] = snap.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<post, 'id'>)
        }));

        console.log(fetchedPosts);
        return { fetchedPosts, lastDoc: snap.docs[snap.docs.length - 1] };

    }
    async function loadPosts() {
        if (user && !loadingRef.current && !endReached) {
            loadingRef.current = true;
            if (loading || endReached) return;
            setLoading(true);
            const { fetchedPosts: newPosts, lastDoc: newLastDoc } = await fetchPosts(lastDoc, user?.uid);

            if (newPosts.length == 0) {
                setEndReached(true);
            } else {
                setPosts(prev => {
                    const ids = new Set(prev.map(p => p.id));
                    return [...prev, ...newPosts.filter(p => !ids.has(p.id))];
                });
                setLastDoc(newLastDoc);
            }
            loadingRef.current = false;
            setLoading(false);
        };
    }

    useEffect(() => {
        loadPosts();
    }, [])

    return (
        <View style={{ backgroundColor: "#17171d", paddingTop: insets.top, flex: 1, overflow: "hidden" }}>

            <HomeHeader tY={translateY} h={50 + insets.top} pT={insets.top} />

            <Animated.FlatList
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                data={posts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <Post uid={item.uid} timestamp={item.timestamp} message={item.post_message} used_media={item.used_media} media={item.media} />
                )}
                style={{ backgroundColor: "#17171d", flex: 1, height: "100%", marginBottom: 100, }}
                onScroll={e => {
                    scrollY.setValue(e.nativeEvent.contentOffset.y);
                }}
                onEndReached={loadPosts}
                onEndReachedThreshold={0.5}
                ListHeaderComponent={<View style={{ height: 50 + insets.top }}></View>}
                ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
                removeClippedSubviews={true}
                initialNumToRender={postLimit}
                maxToRenderPerBatch={postLimit}
            />


        </View>
    );
}

