//components
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Animated, Image, Pressable, StyleSheet } from "react-native";
import CustomText from "../display/customText";

//contexts
import { useUserData } from "../../contexts/userContext";

//navigation
import { auth, db } from "@auth/firebase";
import { useTheme } from "@contexts/themeContext";
import { useRouter } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

//typecasting

interface Props {
    tY: any,
    h: number,
    pT: number
}


export default function HomeHeader({ tY, h, pT }: Props) {
    const { colors } = useTheme();
    const router = useRouter();
    const { userData } = useUserData();
    const user = auth.currentUser;
    const [unreadCount, setUnreadCount] = useState(0);
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "notifications", user ? user.uid : ""), (doc) => {
            const data = doc.data()?.unread_count
            setUnreadCount(data);
        });
    }, [])

    const styles = StyleSheet.create({
        button: {
            marginHorizontal: 5,
            padding: 7,
            borderRadius: 20
        },
        header: {
            margin: 0,
            position: "absolute",
            backgroundColor: colors.background,
            left: 0,
            right: 0,
            width: "100%",
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
            paddingVertical: 10,
            marginVertical: 5,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            elevation: 10,
            zIndex: 1,
        }
    });

    return (
        // will remove animated view later
        <Animated.View style={[styles.header, { height: h, paddingTop: pT, transform: [{ translateY: tY }] }]}>
            <Pressable onPress={() => router.navigate('/(tabs)/profile/')}>
                <Image source={userData?.avatar ? { uri: userData.avatar } : require("@assets/images/pfp.jpg")} style={{ borderRadius: 50, width: 30, height: 30, marginHorizontal: 10 }} />
            </Pressable>

            <CustomText style={{ fontSize: 18, color: colors.text, marginRight: "auto" }}> Ahoy, Hacker!</CustomText>
            <Pressable style={[{ position: "relative" }, styles.button]} onPress={() => { router.push('/(tabs)/home/notifications') }}>
                <MaterialDesignIcons name={"bell"} color={colors.text} size={25} />
                {
                    (unreadCount > 0) ?
                        <MaterialDesignIcons style={{ position: "absolute", top: 4, right: 2, zIndex: 2 }} name={"circle"} color={colors.primary} size={10} />
                        :
                        null
                }
            </Pressable>
            <Pressable style={styles.button} onPress={() => { router.navigate('/(tabs)/home/settings') }}>
                <MaterialDesignIcons name="cog-outline" color={colors.text} size={25} />
            </Pressable>
        </Animated.View>
    );
}
