//components
import Comment from "@components/containers/comment";
import Post from "@components/containers/post";
import NothingHere from "@components/display/nothing";
import { Stack } from "expo-router";
import { FlatList, KeyboardAvoidingView, RefreshControl, View } from "react-native";

//firebase
import {
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    where
} from "firebase/firestore";

import { auth, db } from "@auth/firebase";

//others
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//react 
import React, { useEffect, useState } from 'react';

//func
import { chunkArray } from "@utils/arrayUtils";

//typecasting
import CustomText from "@components/display/customText";
import OnlyIconButton from "@components/inputs/onlyIconButton";
import { comment, post, UserData } from "@utils/types";

type UserDataWithId = UserData & {
    id: string;
}

export default function CommentsScreen() {
    const [loading, setLoading] = useState(true);
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const { post_id } = useLocalSearchParams<{ post_id: string }>();
    const user = auth.currentUser;

    const [usersData, setUsersData] = useState<Record<string, UserData>>({})
    const [commentData, setCommentData] = useState<comment[]>([]);

    const [postData, setPostData] = useState<post>();

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        loadComments();
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

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
            return d;
        })

    }


    async function loadComments() {
        const c = collection(db, "posts", post_id, "comments");
        const q = query(c, orderBy("timestamp", "desc"));
        try {
            getDocs(q).then((data) => {
                const comments: comment[] = data.docs.map(doc => (
                    {
                        id: doc.id,
                        ...(doc.data() as Omit<comment, "id">)
                    }
                ));

                setCommentData(comments);
                let commentUids = []
                for (let i = 0; i < comments.length; ++i) {
                    commentUids.push(comments[i].uid);
                }
                const uidChunks = chunkArray(commentUids, 20);

                for (let i = 0; i < uidChunks.length; ++i) {
                    getUsersData(uidChunks[i])
                    // .then(() => { console.log(usersData, "is the data") });
                }
            }
            ).catch((e) => {
                console.log("error: ", e)
            });
        } catch (e) {
            console.log(e);
        }
    }

    async function getPostData() {
        const d = doc(db, "posts", post_id);
        const snap = await getDoc(d);
        setPostData(snap.data() as post);
    }
    useEffect(() => {
        loadComments();
        getPostData();
    }, [])

    useEffect(() => {
        if (!user && !usersData && !commentData && !postData) {
            setLoading(true);
        } else {
            setLoading(false);
        }
    })

    if (loading) {
        return (
            <Stack>
                <Stack.Screen name="loading" options={{ headerShown: false }} />
            </Stack>
        );
    }

    return (
        <KeyboardAvoidingView behavior={"height"} style={{ backgroundColor: "#17171d", flex: 1, alignItems: "center", paddingTop: insets.top }}>
            <FlatList
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                data={commentData}
                keyExtractor={item => item.id}
                renderItem={({ item }: { item: comment }) => (
                    <Comment
                        uid={item.uid}
                        imgSrc={usersData[item.uid]?.avatar ?? "https://i.pinimg.com/736x/15/0f/a8/150fa8800b0a0d5633abc1d1c4db3d87.jpg"}
                        displayName={usersData[item.uid]?.displayName ?? "Some User..."}
                        message={item.message}
                        timestamp={item.timestamp}
                    />
                )}
                ListHeaderComponent={
                    <View style={{ paddingTop: insets.top }}>
                        <OnlyIconButton icon="arrow-left" func={() => { router.back() }} style={{ position: "absolute", top: 0, left: 20, zIndex: 5 }} />
                        <CustomText style={{ color: "white", left: 80, fontSize: 18, top: 0, fontWeight: 700 }}>Comments</CustomText>
                        {
                            postData ?
                                <Post id={post_id} user_uid={postData.uid} media={postData.media} used_media={postData.used_media} message={postData.post_message}
                                    timestamp={postData.timestamp} like_count={postData.likes} comment_count={postData.num_comments} uid={postData.uid} />
                                : <View></View>
                        }

                    </View>
                }
                ListEmptyComponent={
                    <NothingHere text="No comments yet... " />
                }
                ListFooterComponent={
                    <View style={{ paddingBottom: 100 }} />
                }
                style={{ backgroundColor: "#17171d", flex: 1, height: "100%" }}
                removeClippedSubviews={true}
            />
        </KeyboardAvoidingView>
    );
}
