import { Pressable, Image, View, FlatList, StyleSheet, RefreshControl, KeyboardAvoidingView } from "react-native";
import CustomText from "../components/customText";
import React, { useEffect, useState } from 'react';
import { useRoute } from "@react-navigation/native";
import { auth, db } from "../auth/firebase";
import { updateDoc, doc, increment, serverTimestamp, addDoc, where, collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import InputBox from "../components/inptField";
import NothingHere from "../components/nothing";

interface comment {
    id: string,
    uid: string,
    message: string,
    timestamp: Timestamp,
    likes: number
}

type UserData = {
    bio?: string;
    avatar?: string;
    email?: string;
    num_logs?: number;
    num_trackers?: number;
    num_tracking?: number;
    displayName?: string;
    createdAt?: Timestamp;
    friends?: string[];
};


export default function CommentsScreen({ navigation }) {
    const [refreshing, setRefreshing] = React.useState(false);
    const route = useRoute();
    const { post_id } = route.params;

    const user = auth.currentUser;

    const [usersData, setUsersData] = useState<[uid: UserData]>([])

    const [comment, setComment] = useState("");

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        loadComments();
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    const [commentData, setCommentData] = useState<comment[]>([]);

    async function addComment() {
        try {
            console.log("trying to comment");
            await addDoc(collection(db, "posts", post_id, "comments"), {
                uid: user.uid,
                message: comment,
                timestamp: serverTimestamp(),
                likes: 0
            })
            console.log("done!");
            await updateDoc(doc(db, "posts", post_id),
                {
                    num_comments: increment(1)
                })
            loadComments();
            setComment("");
        } catch (e) {
            console.log(e);
        }
    }

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
            console.log(d, "is the user's data");
            return d;
        })

    }
    function extractTime(time: Timestamp) {
        const dateSeconds = time.toDate().getTime();
        const now = (new Date()).getTime();

        const seconds = Math.floor((now - dateSeconds) / 1000);

        const intervals = {
            year: 365 * 24 * 60 * 60,
            month: 30 * 24 * 60 * 60,
            day: 86400,
            hr: 3600,
            minute: 60,
            second: 1
        }
        for (const [unit, value] of Object.entries(intervals)) {
            const count = Math.floor(seconds / value);
            if (count >= 1) {
                return `${count} ${unit}${count >= 1 ? "s" : ""} ago`
            }
        }
        return "just now";

    }

    function chunkArray(arr: string[], chunkSize: number) {
        const newArr = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            newArr.push(arr.slice(i, i + chunkSize));
        }
        return newArr;
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
                    <View style={styles.commentContainer}>
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%" }}>
                            <View style={{ alignItems: "center", justifyContent: "flex-start", width: "auto", height: "100%", marginTop: 20 }}>
                                <Image source={{ uri: usersData[item.uid]?.avatar ?? "https://i.pinimg.com/736x/15/0f/a8/150fa8800b0a0d5633abc1d1c4db3d87.jpg" }} style={{ borderRadius: 50, width: 40, height: 40 }} />
                            </View>
                            <View style={styles.detailsContainer}>
                                <View style={{ flexDirection: "row", alignContent: "center", position: "static" }}>
                                    <CustomText style={styles.username}>{usersData[item.uid]?.displayName ?? "Some User..."}</CustomText>
                                    <CustomText style={[styles.subtxt, { marginLeft: 20 }]}>{extractTime(item.timestamp)}</CustomText>
                                    <Pressable style={{ top: 5, right: 0, padding: 5, position: "absolute" }}>
                                        <MaterialDesignIcons name="dots-vertical" color="#5f6878" size={25} />
                                    </Pressable>
                                </View>

                                <CustomText style={styles.message}>{item.message}</CustomText>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <Pressable style={{ padding: 5, flexDirection: "row", alignItems: "center" }}>
                                <MaterialDesignIcons name="thumb-up-outline" color="#5f6878" size={25} />
                                <CustomText style={{ color: "#8492a6", marginLeft: 5 }}>0</CustomText>
                            </Pressable>
                            <Pressable style={{ padding: 5, flexDirection: "row", alignItems: "center" }}>
                                <MaterialDesignIcons name="thumb-down-outline" color="#5f6878" size={25} />
                                <CustomText style={{ color: "#8492a6", marginLeft: 5 }}>0</CustomText>
                            </Pressable>
                            <Pressable style={{ padding: 5, flexDirection: "row", alignItems: "center" }}>
                                <CustomText style={{ color: "#8492a6", marginLeft: 5 }}>Reply</CustomText>
                            </Pressable>
                        </View>

                    </View>
                )}
                ListEmptyComponent={
                    <NothingHere text="No comments yet... " />
                }
                style={{ backgroundColor: "#17171d", flex: 1, height: "100%" }}
                removeClippedSubviews={true}
            />
            <View style={{ marginBottom: 70, flexDirection: "row", alignItems: "center", width: "100%", borderColor: "#25252fff", borderTopWidth: StyleSheet.hairlineWidth }}>
                <InputBox secure={false} value={comment} valueFn={setComment} color="#8492a6" icon="comment" type="none" placeholder="Comment here" />
                <Pressable style={{ padding: 8 }} onPress={addComment}>
                    <MaterialDesignIcons name="send" color="#5f6878" size={25} />
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        width: '95%',
        marginVertical: 5,
        borderRadius: 12,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#444456ff",
    },
    commentContainer: {
        position: "relative",
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: "100%",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#444456ff"
    },
    username: {
        fontSize: 15,
        fontWeight: 600,
        color: "#338eda",
        textAlign: "left",
        width: "auto",
        marginBottom: 5
    },
    message: {
        fontSize: 13,
        color: "#a4b2c6ff",
        textAlign: "left",
        width: "auto"
    },
    subtxt: {
        fontSize: 13,
        color: "#a4b2c6ff",
        textAlign: "left",
        position: "static",
        width: "auto",
    },
    detailsContainer: {
        padding: 15,
        display: "flex",
        width: "80%",
        justifyContent: "center",
        alignItems: "flex-start"
    }


});