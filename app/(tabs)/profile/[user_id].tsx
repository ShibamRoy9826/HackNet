//components
import ProfileHeader from "@components/containers/ProfileHeader";
import CustomText from '@components/display/customText';
import RadioBtn from "@components/inputs/radioBtn";
import { StyleSheet, View } from 'react-native';

//react
import React, { useEffect, useState } from "react";

//firestore
import { auth, db } from "@auth/firebase";
import { doc, getDoc } from "firebase/firestore";

//typecasting
import PostList from "@components/display/postList";
import { UserData } from "@utils/types";
import { useLocalSearchParams } from 'expo-router';


export default function ProfileScreen() {
    const { user_id } = useLocalSearchParams<{ user_id: string }>()

    const [currTab, setCurrTab] = useState("Logs");

    const [userData, setUserData] = useState<UserData>();
    const [sameUser, setSameUser] = useState(true);

    const currentUser = auth.currentUser;


    const [uid, setUid] = useState(currentUser ? (currentUser.uid) : "");


    async function postWrapper() {
        if (!user_id) {

            getDoc(doc(db, "users", uid)).then(
                (userSnap) => {
                    setUserData({
                        uid: uid,
                        ...(userSnap.data()) as Omit<UserData, "uid">
                    });
                }
            );
        } else {
            getDoc(doc(db, "users", user_id)).then(
                (userSnap) => {
                    setUserData({
                        uid: uid,
                        ...(userSnap.data()) as Omit<UserData, "uid">
                    });
                }
            );
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



    return (
        <PostList
            uidFilter={user_id ? user_id : currentUser ? currentUser.uid : ""}
            Header={
                <View style={{ backgroundColor: "#17171d", flex: 1 }}>
                    <ProfileHeader sameUser={sameUser} user_id={user_id} userData={userData} />
                    <RadioBtn
                        options={["Logs"]}
                        iconList={["post"]}
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
        />
    );
}

