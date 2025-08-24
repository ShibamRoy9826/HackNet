//components
import Post from "@/components/containers/post";
import ProfileHeader from "@/components/containers/ProfileHeader";
import CustomText from '@/components/display/customText';
import NothingHere from "@/components/display/nothing";
import RadioBtn from "@/components/inputs/radioBtn";
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

//react
import React, { useEffect, useState } from "react";

//firestore
import { auth, db } from "@/auth/firebase";
import { collection, doc, getDoc, getDocs, limit, query, where } from "firebase/firestore";

//typecasting
import { UserData, post } from "@/utils/types";
import { useLocalSearchParams } from 'expo-router';


export default function OtherProfileScreen() {
    const { user_id } = useLocalSearchParams<{ user_id: string }>()

    const user = auth.currentUser;
    const sameUser = (user ? user.uid : "") === user_id;

    const [userOwnPosts, setOwnPosts] = useState<post[]>([]);
    const [likedPosts, setLikedPosts] = useState<post[]>([]);

    const [currTab, setCurrTab] = useState("Logs");

    const [refreshing, setRefreshing] = React.useState(false);

    const [userData, setUserData] = useState<UserData>();

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        showPosts();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    async function showOwnPosts() {
        if (userData) {
            const getUsersQuery = query(
                collection(db, "posts"),
                where('uid', '==', user_id),
                limit(5)
            )
            const snapshot = await getDocs(getUsersQuery);

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data()) as Omit<post, "id">
            }));
        } else {
            return [];
        }
    }

    async function showPosts() {
        const ownPosts = await showOwnPosts();
        setOwnPosts(ownPosts);
        const snap = await getDoc(doc(db, "users", user_id));
        setUserData({
            uid: user_id,
            ...(snap.data()) as Omit<UserData, "uid">
        });
    }

    useEffect(() => {
        showPosts();
    }, [])

    return (
        <FlatList
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            data={(currTab === "Logs") ? userOwnPosts : likedPosts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <Post comment_count={item.num_comments} user_uid={userData ? userData.uid : ""} id={item.id} uid={item.uid} timestamp={item.timestamp} message={item.post_message} used_media={item.used_media} media={item.media} like_count={item.likes} />
            )}
            removeClippedSubviews={true}
            ListEmptyComponent={
                <NothingHere />
            }
            ListHeaderComponent={
                <View style={{ backgroundColor: "#17171d", flex: 1 }}>
                    <ProfileHeader user_id={user_id} userData={userData} />
                    <RadioBtn
                        options={["Logs", "Liked Logs"]}
                        iconList={["post", "heart"]}
                        selected={currTab}
                        setSelected={setCurrTab}
                        style={{ marginHorizontal: 10 }}
                    />

                    <View style={{ backgroundColor: "#373d46ff", width: "100%", height: StyleSheet.hairlineWidth }} />
                    <CustomText
                        style={{
                            color: "white", textAlign: "left", paddingLeft: 10, fontSize: 20, fontWeight: "bold", marginVertical: 20
                        }}>
                        {(currTab === "Logs") ? (sameUser ? "Your Logs" : "Logs") : "Liked Logs"}</CustomText>
                </View>

            }
            style={{ backgroundColor: "#17171d" }}
        />
    );
}

