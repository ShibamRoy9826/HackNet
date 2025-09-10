//components
import Post from "@components/containers/post";
import { RefreshControl, View } from "react-native";

//others
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//react
import React, { useCallback, useRef, useState } from "react";

//firebase
import { auth, db } from '@auth/firebase';
import { collection, getDocs, limit, orderBy, query, QueryDocumentSnapshot, startAfter, where } from 'firebase/firestore';

//typecasting
import { FlashList, ListRenderItem, ListRenderItemInfo } from "@shopify/flash-list";
import { post } from "@utils/types";
import NothingHere from "./nothing";

const postLimit = 10;

interface Props {
    uidFilter?: string,
    Header?: React.ReactNode
}

export default function PostList({ uidFilter, Header }: Props) {
    const insets = useSafeAreaInsets();
    const user = auth.currentUser;

    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState<post[]>([]);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setLastDoc(null);
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

    async function fetchPosts(lastDoc: QueryDocumentSnapshot | null) {
        let q;
        if (uidFilter) {
            q = query(
                collection(db, "posts"),
                orderBy("timestamp", 'desc'),
                limit(postLimit),
                where("uid", "==", uidFilter));
        } else {
            q = query(
                collection(db, "posts"),
                orderBy("timestamp", 'desc'),
                limit(postLimit));
        }

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
        if (user && !loadingRef.current) {
            loadingRef.current = true;

            if (loading) return;
            setLoading(true);

            fetchPosts(lastDoc).then(
                ({ fetchedPosts: newPosts, lastDoc: newLastDoc }) => {
                    setPosts(prev => {
                        const ids = new Set(prev.map(p => p.id));
                        const onlyNew = newPosts.filter(p => !ids.has(p.id));
                        if (onlyNew.length === 0) return prev;
                        return [...prev, ...onlyNew];
                    });
                    setLastDoc(newLastDoc);
                }
            ).finally(() => {
                loadingRef.current = false;
                setLoading(false);
            }).catch((e) => { console.log("couldn't fetch posts", e) });

        };
    }
    return (
        <FlashList
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            data={posts}
            renderItem={renderPost}
            keyExtractor={item => item.id}
            ListHeaderComponent={
                <View>
                    {Header}
                </View>
            }
            ListFooterComponent={<View style={{ marginBottom: 100 }}></View>}
            ListEmptyComponent={<NothingHere text="No posts yet:(" />}
            onEndReached={() => { loadPosts(); }}
            onEndReachedThreshold={0.5}
            estimatedItemSize={200}
        />

    );
}
