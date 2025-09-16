import CustomText from '@components/display/customText';
import CustomPressable from '@components/inputs/customPressable';
import { useTheme } from '@contexts/themeContext';
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Image, StyleSheet, View } from "react-native";

interface Props {
    username: string,
    lastMessage: string
}
export default function FriendElement({ username, lastMessage }: Props) {
    const { colors } = useTheme();
    const styles = StyleSheet.create({
        friendBox: {
            padding: 10,
            width: "100%",
            height: 80,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
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
            width: "80%",
            justifyContent: "center",
            alignItems: "flex-start"
        }

    })
    return (
        <View style={styles.friendBox}>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%", paddingHorizontal: 10 }}>
                <Image source={require("@assets/images/pfp.jpg")} style={{ borderRadius: 50, width: 45, height: 45, margin: "auto" }} />
                <View style={styles.detailsContainer}>
                    <CustomText style={styles.username}>{username}</CustomText>
                    <CustomText style={styles.lastMessage}>{lastMessage}</CustomText>
                </View>
                <View>
                    <CustomPressable style={{ padding: 5, marginLeft: "auto" }}>
                        <MaterialDesignIcons name="dots-vertical" color={colors.muted} size={25} />
                    </CustomPressable>
                </View>
            </View>
        </View>
    );
}
