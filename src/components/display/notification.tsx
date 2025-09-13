import { auth } from '@auth/firebase';
import { useTheme } from '@contexts/themeContext';
import { deleteNotifObject, markAsReadUnread } from '@utils/notificationUtils';
import { extractTime } from '@utils/stringTimeUtils';
import * as Linking from 'expo-linking';
import { Timestamp } from "firebase/firestore";
import { Pressable, StyleSheet, View } from "react-native";
import CustomText from "./customText";
import ThreeDots from './threeDots';

interface Props {
    id: string,
    message: string,
    title: string,
    data: { url: string },
    createdAt: Timestamp,
    status: "read" | "unread"
}

export default function NotificationBox({ id, message, title, data, createdAt, status }: Props) {
    const { colors } = useTheme();
    const user = auth.currentUser
    function redirectUser() {
        Linking.openURL(data.url);
    }

    const styles = StyleSheet.create({
        container: {
            padding: 10,
            width: "100%",
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
            borderRadius: 12,
            position: "relative",
            marginVertical: 4
        },
        title: {
            fontSize: 18,
            fontWeight: 600,
            color: colors.text,
            textAlign: "left",
            width: "100%"
        },
        message: {
            fontSize: 13,
            color: colors.muted,
            textAlign: "left",
            width: "100%",
            margin: 10
        },
        time: {
            fontSize: 13,
            color: colors.muted,
            textAlign: "left",
            width: "100%",
            marginHorizontal: 20,
            marginTop: 10
        },
        detailsContainer: {
            padding: 15,
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center"
        }
    });
    return (
        <View style={styles.container} >
            <View style={{ position: "absolute", top: 10, right: 10, zIndex: 6, padding: 5 }}>
                <ThreeDots
                    data={[
                        { text: status == "read" ? 'Mark as Unread' : "Mark as Read", icon: "sticker-check-outline", func: () => { markAsReadUnread(user ? user.uid : "", id, status); } },
                        { text: 'Delete Message', icon: "delete", func: () => { deleteNotifObject(user ? user.uid : "", id, status); } }
                    ]}
                />

            </View>

            <CustomText style={styles.time}>{extractTime(createdAt)}</CustomText>
            <Pressable onPress={() => { status == "unread" ? markAsReadUnread(user ? user.uid : "", id, status) : null; redirectUser() }} style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%", paddingHorizontal: 5 }}>
                <View style={styles.detailsContainer}>
                    <CustomText style={styles.title}>{title}</CustomText>
                    <CustomText style={styles.message}>{message}</CustomText>
                </View>
            </Pressable>
        </View>
    );
}
