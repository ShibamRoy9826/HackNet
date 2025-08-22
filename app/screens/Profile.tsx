//components
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import CustomText from '../components/display/customText';
import RadioBtn from "../components/inputs/radioBtn";
import Post from "../components/containers/post";
import NothingHere from "../components/display/nothing";
import ProfileHeader from "../components/containers/ProfileHeader";

//react
import React, { useEffect, useState } from "react";

//firestore
import { db, auth } from "../auth/firebase";
import { limit, query, collection, where, getDocs } from "firebase/firestore";

//contexts
import { useUserData } from '../contexts/userContext';

//typecasting
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { post, AppTabParamList } from "../utils/types";


type Prop = BottomTabScreenProps<AppTabParamList, "Profile">


export default function ProfileScreen({ navigation }: Prop) {
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
                ...(doc.data()) as Omit<post, "id">
            }));
        } else {
            return [];
        }
    }

    async function showPosts() {
        const ownPosts = await showOwnPosts();
        setOwnPosts(ownPosts);
    }

    useEffect(() => {
        showPosts();
    }, [showPosts])

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
                    <ProfileHeader userData={userData} navigation={navigation} />
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
                        {(currTab === "Logs") ? "Your Logs" : "Liked Logs"}</CustomText>
                </View>

            }
            style={{ backgroundColor: "#17171d", marginBottom: 100 }}
        />
    );
}

