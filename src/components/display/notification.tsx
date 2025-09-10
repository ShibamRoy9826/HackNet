import * as Linking from 'expo-linking';
import { Timestamp } from "firebase/firestore";
import { Pressable, StyleSheet, View } from "react-native";
import CustomText from "./customText";
import ThreeDots from './threeDots';

interface Props {
    message: string,
    title: string,
    data: { url: string },
    createdAt: Timestamp
}

export default function NotificationBox({ message, title, data, createdAt }: Props) {

    function redirectUser() {
        Linking.openURL(data.url);
    }
    return (
        <Pressable style={styles.container} onPress={() => { redirectUser() }}>
            <View style={{ position: "absolute", top: 10, right: 10, zIndex: 6, padding: 5 }}>
                <ThreeDots
                    data={[
                        { text: 'Mark as Read', icon: "sticker-check-outline", func: () => { } }
                    ]}
                />

            </View>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%", paddingHorizontal: 5 }}>
                <View style={styles.detailsContainer}>
                    <CustomText style={styles.title}>{title}</CustomText>
                    <CustomText style={styles.message}>{message}</CustomText>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        width: "100%",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#444456ff",
        borderRadius: 12,
        position: "relative"
    },
    title: {
        fontSize: 18,
        fontWeight: 600,
        color: "white",
        textAlign: "left",
        width: "100%"
    },
    message: {
        fontSize: 13,
        color: "#8492a6",
        textAlign: "left",
        width: "100%",
        margin: 10
    },
    detailsContainer: {
        padding: 15,
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "flex-start"
    }
});