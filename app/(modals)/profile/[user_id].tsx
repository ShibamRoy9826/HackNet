//components
import Post from "@components/containers/post";
import ProfileHeader from "@components/containers/ProfileHeader";
import CustomText from '@components/display/customText';
import NothingHere from "@components/display/nothing";
import RadioBtn from "@components/inputs/radioBtn";
import { FlatList, ListRenderItem, ListRenderItemInfo, RefreshControl, StyleSheet, View } from 'react-native';

//react
import { useTheme } from "@contexts/themeContext";
import React, { useCallback, useEffect, useState } from "react";

//firestore
import { auth, db } from "@auth/firebase";
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";

//typecasting
import { UserData, post } from "@utils/types";
import { useLocalSearchParams } from 'expo-router';


export default function OtherProfileModal() {
    const { user_id } = useLocalSearchParams<{ user_id: string }>()

    const [refreshing, setRefreshing] = useState(false);
    const [currTab, setCurrTab] = useState("Logs");

    const [ownPosts, setOwnPosts] = useState<post[]>([]);
    const [userData, setUserData] = useState<UserData>();
    const [sameUser, setSameUser] = useState(true);

    const currentUser = auth.currentUser;


    const [uid, setUid] = useState(currentUser ? (currentUser.uid) : "");

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        postWrapper();
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    //func
    const renderPost: ListRenderItem<post> = useCallback(({ item }: ListRenderItemInfo<post>) =>
    (
        <Post comment_count={item.num_comments}
            user_uid={currentUser ? currentUser.uid : ""}
            id={item.id}
            uid={item.uid}
            timestamp={item.timestamp}
            message={item.post_message}
            used_media={item.used_media}
            media={item.media} />

    ), [currentUser])

    async function showPosts(UID: string) {
        const c = collection(db, "posts");
        const q = query(c,
            where("uid", "==", UID),
            orderBy("timestamp", "desc"),
            limit(5)
        )
        const snap = await getDocs(q);

        return snap.docs.map(doc => ({
            id: doc.id,
            ...(doc.data()) as Omit<post, "id">
        }));
    }

    async function postWrapper() {
        if (!user_id) {
            const posts = await showPosts(uid);
            setOwnPosts(posts);

            const userSnap = await getDoc(doc(db, "users", uid));
            setUserData({
                uid: uid,
                ...(userSnap.data()) as Omit<UserData, "uid">
            });
        } else {
            const posts = await showPosts(user_id);
            setOwnPosts(posts);
            const userSnap = await getDoc(doc(db, "users", user_id));
            setUserData({
                uid: user_id,
                ...(userSnap.data()) as Omit<UserData, "uid">
            });

        }

    }

    //effects
    useEffect(() => {
        if (user_id) {
            if (user_id !== uid) {
                setSameUser(false);
                setUid(user_id);
            }
        }
        postWrapper();
    }, [])

    const { colors } = useTheme();



    return (

        <FlatList
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            data={ownPosts}
            keyExtractor={item => item.id}
            renderItem={renderPost}
            removeClippedSubviews={true}
            ListEmptyComponent={
                <NothingHere />
            }
            ListHeaderComponent={
                <View style={{ backgroundColor: colors.background, flex: 1 }}>
                    <ProfileHeader sameUser={sameUser} user_id={user_id} userData={userData} />
                    <RadioBtn
                        options={["Logs", "Liked Logs"]}
                        iconList={["post", "heart"]}
                        selected={currTab}
                        setSelected={setCurrTab}
                        style={{ marginHorizontal: 10 }}
                    />

                    <View style={{ backgroundColor: colors.background, width: "100%", height: StyleSheet.hairlineWidth }} />
                    <CustomText
                        style={{
                            color: colors.text, textAlign: "left", paddingLeft: 10, fontSize: 20, fontWeight: "bold", marginVertical: 20
                        }}>
                        {(currTab === "Logs") ? (sameUser ? "Your Logs" : "Logs") : "Liked Logs"}</CustomText>
                </View>
            }
            ListFooterComponent={
                <View style={{ paddingBottom: 100 }} />
            }
            style={{ backgroundColor: colors.background }}
        />
    );
}

