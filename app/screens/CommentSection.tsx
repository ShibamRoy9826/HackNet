//components
import { Pressable, View, FlatList, StyleSheet, RefreshControl, KeyboardAvoidingView } from "react-native";
import InputBox from "../components/inputs/inptField";
import NothingHere from "../components/display/nothing";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

//firebase
import {
    where,
    collection,
    getDocs,
    orderBy,
    query
} from "firebase/firestore";

import { auth, db } from "../auth/firebase";

//react 
import React, { useEffect, useState } from 'react';

//func
import { addComment } from "../utils/otherUtils";
import { chunkArray } from "../utils/arrayUtils";

//typecasting
import { comment, UserData } from "../utils/types";
import { AppStackParamList } from "../utils/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Comment from "../components/containers/comment";


type Props = NativeStackScreenProps<AppStackParamList, 'Comments'>;

export default function CommentsScreen({ navigation, route }: Props) {
    const { post_id } = route.params;
    const user = auth.currentUser;

    const [usersData, setUsersData] = useState<[uid: UserData]>([])
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
        if (userList.length == 0) {
            return [];
        };

        let userData = {};

        const q = query(
            collection(db, "users"),
            where("uid", "in", userList)
        );
        const snap = await getDocs(q);
        snap.forEach(doc => {
            const data = doc.data();
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
                        ...(doc.data())
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
        <KeyboardAvoidingView behavior={"height"} style={{ backgroundColor: "#17171d", flex: 1, alignItems: "center" }}>
            <FlatList
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                data={commentData}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <Comment
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
                <Pressable style={{ padding: 8 }} onPress={() => { addComment(comment, post_id, user?.uid, () => { loadComments(); setComment(""); }) }}>
                    <MaterialDesignIcons name="send" color="#5f6878" size={25} />
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}
