import { auth, getUserData } from "@auth/firebase";
import CustomText from "@components/display/customText";
import ThreeDots from "@components/display/threeDots";
import CustomPressable from "@components/inputs/customPressable";
import { useDataContext } from "@contexts/dataContext";
import { useTheme } from "@contexts/themeContext";
import { deleteAllMessages } from "@utils/chatUtils";
import { report } from "@utils/otherUtils";
import { UserData } from "@utils/types";
import { unfriend } from "@utils/userUtils";
import { useRouter } from "expo-router";
import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";

interface Props {
    chatId: string,
    uid: string,
    updatedAt: Timestamp;
    lastMessage: string;
    lastSender: string,
}

export default function FriendBox({ lastSender, chatId, uid, updatedAt, lastMessage }: Props) {
    const router = useRouter();
    const user = auth.currentUser;
    const [senderData, setSenderData] = useState<UserData>();
    const { colors } = useTheme();
    const { setUserProfileData } = useDataContext();

    function redirectToProfile() {
        if (uid === (user ? user.uid : "")) {
            router.push(`/(tabs)/profile/${uid}`)
        } else {
            router.push(`/(modals)/profile/${uid}`)
        }
    }
    function redirectToChat() {
        router.push(`/(tabs)/friends/${chatId}`);
        setUserProfileData(senderData);
    }

    async function setSender() {
        const data = await getUserData("users", uid) as UserData;
        setSenderData(data);
    }

    useEffect(() => {
        setSender();
    }, [])


    const styles = StyleSheet.create({
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
            width: "100%",
            marginBottom: 3
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
            width: "100%",
            justifyContent: "center",
            alignItems: "flex-start"
        }

    })
    return (
        <View style={styles.friendBox}>
            <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%", alignItems: "center" }}>
                <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "85%", paddingHorizontal: 10 }}>
                    <CustomPressable onPress={redirectToProfile}>
                        <Image source={{ uri: senderData ? senderData.avatar : "" }} style={{ borderRadius: 50, width: 45, height: 45, margin: "auto" }} />
                    </CustomPressable>
                    <CustomPressable onPress={redirectToChat} style={styles.detailsContainer}>
                        <CustomText style={styles.username}>{senderData ? senderData.displayName : ""}</CustomText>
                        <CustomText style={styles.lastMessage}>{(lastSender === user?.uid) ? "You : " : ""}{lastMessage}</CustomText>
                    </CustomPressable>
                </View>
                <View style={{ padding: 12 }}>
                    <ThreeDots
                        data={[
                            { text: "Clear all chats", icon: "shredder", func: () => { deleteAllMessages(chatId, user ? user.uid : ""); } },
                            { text: "Unfriend", icon: "heart-broken", func: () => { unfriend(uid, user ? user.uid : "", chatId) } },
                            {
                                text: "Report", icon: "exclamation", func: () => {
                                    Alert.alert("Are you sure?", "Please don't make false reports, be sure before doing a report",
                                        [
                                            {
                                                text: "Yes",
                                                onPress: () => {
                                                    report("account", user ? user.uid : "", uid, user ? user.uid : "")
                                                }
                                            },
                                            {
                                                text: "No",
                                                style: "cancel"
                                            }
                                        ]
                                    )
                                }
                            }
                        ]}
                    />

                </View>

            </View>
        </View>
    );
}
