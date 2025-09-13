import { auth, getUserData } from "@auth/firebase";
import CustomText from "@components/display/customText";
import { useTheme } from "@contexts/themeContext";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { UserData } from "@utils/types";
import { acceptRequest, rejectRequest } from "@utils/userUtils";
import { useRouter } from "expo-router";
import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

interface Props {
    id: string,
    createdAt: Timestamp;
}

export default function FriendRequest({ id, createdAt }: Props) {
    const { colors } = useTheme();
    const router = useRouter();
    const user = auth.currentUser;
    const [senderData, setSenderData] = useState<UserData>();

    function redirectToProfile() {
        if (id == (user ? user.uid : "")) {
            router.push(`/(tabs)/profile/${id}`)
        } else {
            router.push(`/(modals)/profile/${id}`)
        }
    }

    async function setSender() {
        const data = await getUserData("users", id) as UserData;
        setSenderData(data);
    }

    useEffect(() => {
        setSender();
    }, [])

    const styles = StyleSheet.create({
        followActivatedBtn: {
            backgroundColor: colors.activated,
            padding: 10,
            borderRadius: 12,
            flexDirection: "row"
        },
        acceptBtn: {
            backgroundColor: colors.secondary,
            padding: 10,
            borderRadius: 12,
            flexDirection: "row"
        },
        rejectBtn: {
            backgroundColor: colors.primary,
            padding: 10,
            borderRadius: 12,
            flexDirection: "row"
        },
        friendBox: {
            padding: 10,
            width: "100%",
            height: 80,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border
        },
        username: {
            fontSize: 15,
            fontWeight: 600,
            color: colors.text,
            textAlign: "left",
            width: "100%"
        },
        lastMessage: {
            fontSize: 13,
            color: colors.muted,
            textAlign: "left",
            width: "100%"
        },
        detailsContainer: {
            padding: 15,
            display: "flex",
            width: "60%",
            justifyContent: "center",
            alignItems: "flex-start"
        }

    })

    return (
        <View style={styles.friendBox}>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%", paddingHorizontal: 10 }}>
                <Pressable onPress={redirectToProfile}>
                    <Image source={{ uri: senderData ? senderData.avatar : "" }} style={{ borderRadius: 50, width: 45, height: 45, margin: "auto" }} />
                </Pressable>
                <View style={styles.detailsContainer}>
                    <Pressable onPress={redirectToProfile}>
                        <CustomText style={styles.username}>{senderData ? senderData.displayName : ""}</CustomText>
                        <CustomText style={styles.lastMessage}>{senderData ? senderData.displayName : ""}</CustomText>
                    </Pressable>
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <Pressable style={styles.acceptBtn} onPress={() => { acceptRequest(id, user ? user.uid : "") }}>
                        {/* <CustomText style={{ color: "white", fontWeight: "bold" }}>Track</CustomText> */}
                        <MaterialDesignIcons name="checkbox-marked-circle-outline" color={colors.text} size={20} />
                    </Pressable>
                    <Pressable style={styles.rejectBtn} onPress={() => { rejectRequest(id, user ? user.uid : "") }}>
                        {/* <CustomText style={{ color: "white", fontWeight: "bold" }}>Track</CustomText> */}
                        <MaterialDesignIcons name="close-circle" color={colors.text} size={20} />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
