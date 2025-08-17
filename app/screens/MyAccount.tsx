import { Text, View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import RadioBtn from "../components/radioBtn";
import { useEffect, useState } from "react";
import { db, auth } from "../auth/firebase";
import Post from "../components/post";
import { useUserData } from '../contexts/userContext';
import React from 'react';
import { limit, query, collection, where, getDocs, Timestamp } from "firebase/firestore";
import NothingHere from "../components/nothing";
import ProfileHeader from "../components/ProfileHeader";

interface post {
    id: string,
    uid: string,
    post_message: string,
    used_media: boolean,
    timestamp: Timestamp
}

export default function MyAccount({ navigation }) {
    const [userOwnPosts, setOwnPosts] = useState<post[]>([]);
    const [likedPosts, setLikedPosts] = useState<post[]>([]);

    const user = auth.currentUser;
    const { userData } = useUserData()

    const [currTab, setCurrTab] = useState("Logs");

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        showPosts();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    async function showOwnPosts() {
        if (user) {
            const getUsersQuery = query(
                collection(db, "posts"),
                where('uid', '==', user.uid),
                limit(5)
            )
            const snapshot = await getDocs(getUsersQuery);

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } else {
            return [];
        }
    }

    async function showPosts() {
        const ownPosts = await showOwnPosts();
        setOwnPosts(ownPosts);

        // const ownPosts = await showLikedPosts();
        // setOwnPosts(ownPosts);
    }

    useEffect(() => {
        showPosts();
    }, [])

    return (
        <FlatList
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            data={(currTab == "Logs") ? userOwnPosts : likedPosts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <Post uid={item.uid} timestamp={item.timestamp} message={item.post_message} used_media={item.used_media} media={item.media} />
            )}
            removeClippedSubviews={true}
            ListEmptyComponent={
                <NothingHere />
            }
            ListHeaderComponent={
                <View style={{ backgroundColor: "#17171d", flex: 1 }}>
                    <ProfileHeader userData={userData} navigation={navigation} />
                    <RadioBtn
                        options={["Logs", "Liked Logs"]}
                        iconList={["post", "heart"]}
                        selected={currTab}
                        setSelected={setCurrTab}
                        style={{ marginHorizontal: 10 }}
                    />

                    <View style={{ backgroundColor: "#373d46ff", width: "100%", height: StyleSheet.hairlineWidth }} />
                    <Text
                        style={{
                            color: "white", textAlign: "left", paddingLeft: 10, fontSize: 20, fontWeight: "bold", marginVertical: 20
                        }}>
                        {(currTab == "Logs") ? "Your Logs" : "Liked Logs"}</Text>
                </View>

            }
            style={{ backgroundColor: "#17171d", marginBottom: 100 }}
        />
    );
}

