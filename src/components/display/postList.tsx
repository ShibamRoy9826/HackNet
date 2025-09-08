//components
import Post from "@components/containers/post";
import { FlatList, ListRenderItem, ListRenderItemInfo, RefreshControl, View } from "react-native";

//others
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//react
import React, { useCallback, useRef, useState } from "react";

//firebase
import { auth, db } from '@auth/firebase';
import { collection, getDocs, limit, orderBy, query, QueryDocumentSnapshot, startAfter } from 'firebase/firestore';

//typecasting
import { post } from "@utils/types";

const postLimit = 10;

export default function PostList() {
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
        let q = query(
            collection(db, "posts"),
            orderBy("timestamp", 'desc'),
            limit(postLimit));

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
        // console.log("loading posts", !loadingRef.current);
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
                    // console.log("setting new posts", newLastDoc)
                    setLastDoc(newLastDoc);
                }
            ).finally(() => {
                loadingRef.current = false;
                setLoading(false);
            }).catch((e) => { console.log("couldn't fetch posts", e) });

        };
    }



    return (
        <FlatList
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            data={posts}
            renderItem={renderPost}
            keyExtractor={item => item.id}
            ListHeaderComponent={<View style={{ height: 50 + insets.top }}></View>}
            ListFooterComponent={<View style={{ marginBottom: 100 }}></View>}
            onEndReached={() => { console.log("End reached!"); loadPosts(); }}
            onEndReachedThreshold={0.9}
            style={{ flex: 1 }}
        />

    );
}
