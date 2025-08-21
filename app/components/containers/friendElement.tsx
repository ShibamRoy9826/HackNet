import { View, StyleSheet, Image, Pressable } from "react-native";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import CustomText from "../display/customText";

interface Props {
    username: string,
    lastMessage: string
}
export default function FriendElement({ username, lastMessage }: Props) {
    return (
        <View style={styles.friendBox}>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%", paddingHorizontal: 10 }}>
                <Image source={require("../../../assets/images/pfp.jpg")} style={{ borderRadius: 50, width: 45, height: 45, margin: "auto" }} />
                <View style={styles.detailsContainer}>
                    <CustomText style={styles.username}>{username}</CustomText>
                    <CustomText style={styles.lastMessage}>{lastMessage}</CustomText>
                </View>
                <View>
                    <Pressable style={{ padding: 5, marginLeft: "auto" }}>
                        <MaterialDesignIcons name="dots-vertical" color="#5f6878" size={25} />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    friendBox: {
        padding: 10,
        width: "100%",
        height: 80,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#444456ff"
    },
    username: {
        fontSize: 15,
        fontWeight: 600,
        color: "white",
        textAlign: "left",
        width: "100%"
    },
    lastMessage: {
        fontSize: 13,
        color: "#8492a6",
        textAlign: "left",
        width: "100%"
    },
    detailsContainer: {
        padding: 15,
        display: "flex",
        width: "80%",
        justifyContent: "center",
        alignItems: "flex-start"
    }

})