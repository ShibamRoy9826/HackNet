//components
import { Image, StyleSheet, View } from "react-native";
import CustomText from "../display/customText";

//react
import { auth, db } from "@auth/firebase";
import ProfileDots from "@components/inputs/profileDots";
import { useTheme } from "@contexts/themeContext";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { checkFollow, followUser, unfollowUser } from "@utils/userUtils";
import { useRouter } from "expo-router";
import { collection, getCountFromServer } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { Pressable } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IconButton from "../inputs/IconButton";
import OnlyIconButton from "../inputs/onlyIconButton";

interface Props {
    userData: any;
    user_id?: string;
    sameUser?: boolean;
    isFollowing?: boolean;
}

export default function ProfileHeader({ sameUser, user_id, userData, isFollowing }: Props) {
    const { colors } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [num_trackers, setNumTrackers] = useState(0);
    const user = auth.currentUser;

    const [followed, setFollow] = useState(isFollowing);

    async function followBtnWrapper() {
        if (followed) {
            setFollow(false);
            await unfollowUser(user_id ? user_id : user ? user.uid : "");
        } else {
            setFollow(true);
            await followUser(user_id ? user_id : user ? user.uid : "");
        }
    }
    async function setTrackersCount() {
        const col = collection(db, "users", user_id ? user_id : user ? user.uid : "", "trackers");
        const trackers = await getCountFromServer(col);
        setNumTrackers(trackers.data().count);

        if (isFollowing === undefined) {
            const isTracking = await checkFollow(user_id ? user_id : user ? user.uid : "");
            setFollow(isTracking);
        }

    }

    function returnBanner(bannerPath: string) {
        // Ik it looks idiotic at first glance, but we can't use dynamic paths with require()
        if (bannerPath === "1") {
            return require("@assets/images/banners/banner01.png")
        } else if (bannerPath === "2") {
            return require("@assets/images/banners/banner02.png")
        } else if (bannerPath === "3") {
            return require("@assets/images/banners/banner03.png")
        } else {
            return require("@assets/images/banners/banner03.png")
        }
    }
    useEffect(() => {
        setTrackersCount();
    }, [])

    const styles = StyleSheet.create({
        followActivatedBtn: {
            backgroundColor: colors.activated,
            padding: 10,
            borderRadius: 12,
            flexDirection: "row",
            marginRight: 30
        },
        followBtn: {
            backgroundColor: colors.primary,
            padding: 10,
            borderRadius: 12,
            flexDirection: "row",
            marginRight: 30
        },
        flexBox: {
            fontSize: 15,
            color: colors.text,
            fontWeight: "bold",
            alignContent: "center",
            justifyContent: "center"
        },
        subtxt: {
            color: colors.smallText,
            fontSize: 15,
            width: "100%",
            marginLeft: 20,
            fontWeight: "normal"
        },
        text: {
            color: colors.text,
            textAlign: "left",
            paddingLeft: 10
        },
        heading: {
            color: colors.text,
            textAlign: "left",
            paddingLeft: 10,
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 20
        },
    })
    return (
        <View style={{ backgroundColor: colors.background, flex: 1, paddingTop: insets.top }}>
            {
                !sameUser ?
                    <View style={{ zIndex: 3 }}>
                        <OnlyIconButton
                            icon="arrow-left"
                            func={() => { router.back(); }}
                            style={{ position: "absolute", zIndex: 3, elevation: 20, top: 10, left: 10 }}
                        />
                        <ProfileDots
                            user_id={user_id ? user_id : ""}
                            style={{ position: "absolute", zIndex: 3, elevation: 20, top: 10, right: 10 }}
                            isFollowing={followed}
                            setFollowing={setFollow}
                        />
                    </View>

                    :
                    <></>
            }

            <View style={{ position: "relative", height: 100 }}>
                <View
                    style={{ width: '100%', zIndex: 1, position: "absolute", height: 122, borderBottomColor: colors.primary, borderBottomWidth: 2 }} >
                    <Image source={userData ?
                        (userData.banner.startsWith("https") ?
                            { uri: userData.banner } : returnBanner(userData.banner)) :
                        require("@assets/images/banners/banner03.png")}
                        style={{ width: '100%', zIndex: 1, position: "absolute", height: 120 }} />
                </View>
                <Image source={userData?.avatar ? { uri: userData.avatar } : require("@assets/images/pfp.jpg")} style={{ zIndex: 3, position: "absolute", bottom: -50, left: 20, width: 70, height: 70, borderRadius: 50, borderWidth: 2, borderColor: colors.primary }} />
            </View>
            <View style={{ position: "relative", width: "100%" }}>
                <View style={{
                    flexDirection: "row", alignItems: "center", justifyContent: "space-between"
                }}>
                    <View>
                        <CustomText style={{ fontSize: 25, color: colors.text, fontWeight: "bold", width: "100%", textAlign: "left", marginTop: 60, marginLeft: 20 }}>{userData?.displayName}</CustomText>
                        <CustomText style={styles.subtxt}>@{userData?.displayNameLower}</CustomText>
                    </View>
                    {
                        !sameUser ?
                            followed ?
                                <Pressable style={styles.followActivatedBtn} onPress={followBtnWrapper}>
                                    <CustomText style={{ color: colors.text, fontWeight: "bold" }}>Untrack</CustomText>
                                    <MaterialDesignIcons name="account-minus" color={colors.text} size={18} style={{ marginLeft: 5 }} />
                                </Pressable>
                                :
                                <Pressable style={styles.followBtn} onPress={followBtnWrapper}>
                                    <CustomText style={{ color: colors.text, fontWeight: "bold" }}>Track</CustomText>
                                    <MaterialDesignIcons name="plus-box" color={colors.text} size={18} style={{ marginLeft: 5 }} />
                                </Pressable>

                            :
                            <IconButton
                                text="Edit Profile"
                                style={{ marginRight: 40, marginTop: 20 }}
                                func={() => { router.push("/(tabs)/profile/edit") }}
                                icon="pencil-box-multiple"
                            />
                    }

                </View>
                <CustomText style={[styles.subtxt, { color: colors.text, marginTop: 20, paddingLeft: 5, paddingRight: 30 }]}>
                    {userData?.bio}
                </CustomText>
                <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "center", marginVertical: 10 }}>
                    <CustomText style={styles.flexBox}>
                        {userData?.num_logs} <CustomText style={[styles.subtxt, { color: colors.muted, marginLeft: 5 }]}>Logs</CustomText>
                    </CustomText>

                    <CustomText style={[{ marginLeft: 20 }, styles.flexBox]}>
                        {num_trackers} <CustomText style={[styles.subtxt, { color: colors.muted, marginLeft: 5 }]}>Trackers</CustomText>
                    </CustomText>

                    <CustomText style={[{ marginLeft: 20 }, styles.flexBox]}>
                        {userData?.num_tracking} <CustomText style={[styles.subtxt, { color: colors.muted, marginLeft: 5 }]}>Tracking</CustomText>
                    </CustomText>
                </View>
            </View>

        </View>
    );
}

