//components
import Comment from "@/components/containers/comment";
import NothingHere from "@/components/display/nothing";
import InputBox from "@/components/inputs/inptField";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { FlatList, KeyboardAvoidingView, Pressable, RefreshControl, StyleSheet, View } from "react-native";

//firebase
import {
    collection,
    getDocs,
    orderBy,
    query,
    where
} from "firebase/firestore";

import { auth, db } from "@/auth/firebase";

//others
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//react 
import React, { useEffect, useState } from 'react';

//func
import { chunkArray } from "@/utils/arrayUtils";
import { addComment } from "@/utils/otherUtils";

//typecasting
import { comment, UserData } from "@/utils/types";
import { useLocalSearchParams } from "expo-router";

type UserDataWithId = UserData & {
    id: string;
}

export default function CommentsScreen() {
    const insets = useSafeAreaInsets();

    const { post_id } = useLocalSearchParams<{ post_id: string }>();
    const user = auth.currentUser;

    const [usersData, setUsersData] = useState<Record<string, UserData>>({})
    const [comment, setComment] = useState("");
    const [commentData, setCommentData] = useState<comment[]>([]);

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
        // return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // return userData;
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
        console.log(post_id, "is the postid");
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

    useEffect(() => {
        loadComments();
    }, [])

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
                ListEmptyComponent={
                    <NothingHere text="No comments yet... " />
                }
                style={{ backgroundColor: "#17171d", flex: 1, height: "100%" }}
                removeClippedSubviews={true}
            />
            <View style={{ marginBottom: 70, flexDirection: "row", alignItems: "center", width: "100%", borderColor: "#25252fff", borderTopWidth: StyleSheet.hairlineWidth }}>
                <InputBox secure={false} value={comment} valueFn={setComment} color="#8492a6" icon="comment" type="none" placeholder="Comment here" />
                <Pressable style={{ padding: 8 }} onPress={() => { addComment(comment, post_id, user ? user.uid : "", () => { loadComments(); setComment(""); }) }}>
                    <MaterialDesignIcons name="send" color="#5f6878" size={25} />
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}
