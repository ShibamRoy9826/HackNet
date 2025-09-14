//components
import Comment from "@components/containers/comment";
import PostHeader from "@components/containers/postHeader";
import NothingHere from "@components/display/nothing";
import { Stack, useLocalSearchParams } from "expo-router";
import { FlatList, KeyboardAvoidingView, View } from "react-native";

//firebase
import {
    collection,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
    where
} from "firebase/firestore";

import { auth, db } from "@auth/firebase";

//others
import { useTheme } from "@contexts/themeContext";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//react 
import React, { useEffect, useState } from 'react';

//func
import { chunkArray } from "@utils/arrayUtils";

//typecasting
import { comment, post, UserData } from "@utils/types";

type UserDataWithId = UserData & {
    id: string;
}

export default function CommentsScreen() {
    const { colors } = useTheme();
    const [loading, setLoading] = useState(true);
    const insets = useSafeAreaInsets();

    const { post_id } = useLocalSearchParams<{ post_id: string }>();
    const user = auth.currentUser;

    const [usersData, setUsersData] = useState<Record<string, UserData>>({})
    const [commentData, setCommentData] = useState<comment[]>([]);

    const [postData, setPostData] = useState<post>();


    async function getUsersData(userList: string[]) {
        if (userList.length === 0) {
            return [];
        };

        let userData: Record<string, UserDataWithId> = {};

        const q = query(
            collection(db, "users"),
            where("uid", "in", userList)
        );
        const snap = await getDocs(q);
        snap.forEach(doc => {
            const data = doc.data() as UserData;
            userData[data.uid] = { id: doc.id, ...data };
        });
        setUsersData(prev => {
            const d = {
                ...prev,
                ...userData
            }
            console.log(d)
            return d;
        })

    }

    useEffect(() => {
        const postSub = onSnapshot(doc(db, "posts", post_id ? post_id : ""), (snap) => {
            const postData = snap.data() as post;
            setPostData(postData);
        })
        const q = query(
            collection(db, "posts", post_id ? post_id : "", "comments"),
            orderBy("timestamp", "desc")
        )
        const commentSub = onSnapshot(q, (snap) => {
            const data: comment[] = snap.docs.map(doc => (
                {
                    id: doc.id,
                    ...(doc.data() as Omit<comment, 'id'>)
                }
            ));
            setCommentData(data);

            let commentUids = []
            for (let i = 0; i < data.length; ++i) {
                commentUids.push(data[i].uid);
            }
            const uidChunks = chunkArray(commentUids, 20);

            for (let i = 0; i < uidChunks.length; ++i) {
                getUsersData(uidChunks[i])
            }
        });
    }, [])

    useEffect(() => {
        if (!user && !usersData && !commentData && !postData) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [user, usersData, commentData, postData])

    if (loading) {
        return (
            <Stack>
                <Stack.Screen name="loading" options={{ headerShown: false }} />
            </Stack>
        );
    }

    return (
        <KeyboardAvoidingView behavior={"height"} style={{ backgroundColor: colors.background, flex: 1, alignItems: "center", paddingTop: insets.top }}>
            <FlatList
                data={commentData}
                keyExtractor={item => item.id}
                renderItem={({ item }: { item: comment }) => (
                    <Comment
                        postId={post_id}
                        uid={item.uid}
                        id={item.id}
                        imgSrc={usersData[item.uid] ? (usersData[item.uid].avatar ?? "https://i.pinimg.com/736x/15/0f/a8/150fa8800b0a0d5633abc1d1c4db3d87.jpg") : "https://i.pinimg.com/736x/15/0f/a8/150fa8800b0a0d5633abc1d1c4db3d87.jpg"}
                        displayName={usersData[item.uid]?.displayName ?? "Some User..."}
                        message={item.message}
                        timestamp={item.timestamp}
                    />
                )}

                ListHeaderComponent={
                    <PostHeader
                        id={postData ? postData.id : ""}
                        isVisible={postData ? true : false}
                        postId={post_id}
                        user_uid={user ? user.uid : ""}
                        media={postData ? postData.media : []}
                        used_media={postData ? postData.used_media : false}
                        message={postData ? postData.post_message : ""}
                        timestamp={postData ? postData.timestamp : Timestamp.now()}
                        comment_count={postData ? postData.num_comments : 0}
                        uid={postData ? postData.uid : ""}
                    />
                }
                ListEmptyComponent={
                    <NothingHere text="No comments yet... " />
                }
                ListFooterComponent={
                    <View style={{ paddingBottom: 100 }} />
                }
                removeClippedSubviews={true}
            />
        </KeyboardAvoidingView>
    );
}
