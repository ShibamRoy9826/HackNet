//components
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Animated, Image, Pressable, StyleSheet } from "react-native";
import CustomText from "../display/customText";

//contexts
import { useUserData } from "../../contexts/userContext";

//navigation
import { auth, db } from "@auth/firebase";
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


    return (
        <Animated.View style={[styles.header, { height: h, paddingTop: pT, transform: [{ translateY: tY }] }]}>
            <Pressable onPress={() => router.navigate('/(tabs)/profile/')}>
                <Image source={userData?.avatar ? { uri: userData.avatar } : require("@assets/images/pfp.jpg")} style={{ borderRadius: 50, width: 30, height: 30, marginHorizontal: 10 }} />
            </Pressable>

            <CustomText style={{ fontSize: 18, color: "white", marginRight: "auto" }}> Ahoy, Hacker!</CustomText>
            <Pressable style={[{ position: "relative" }, styles.button]} onPress={() => { router.push('/(tabs)/home/notifications') }}>
                <MaterialDesignIcons name={"bell"} color="white" size={25} />
                {
                    (unreadCount > 0) ?
                        <MaterialDesignIcons style={{ position: "absolute", top: 4, right: 2, zIndex: 2 }} name={"circle"} color="#ec3750" size={10} />
                        :
                        null
                }
            </Pressable>
            <Pressable style={styles.button} onPress={() => { router.navigate('/(tabs)/home/settings') }}>
                <MaterialDesignIcons name="cog-outline" color="white" size={25} />
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    button: {
        marginHorizontal: 10
    },
    header: {
        margin: 0,
        position: "absolute",
        backgroundColor: "#17171d",
        left: 0,
        right: 0,
        width: "100%",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#25252fff",
        paddingVertical: 10,
        marginVertical: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        elevation: 10,
        zIndex: 1,
    }
});