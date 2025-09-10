//components
import { auth, db } from "@auth/firebase";
import CustomText from "@components/display/customText";
import NothingHere from "@components/display/nothing";
import NotificationBox from "@components/display/notification";
import OnlyIconButton from "@components/inputs/onlyIconButton";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type notification = {
    id: string;
    message: string;
    title: string;
    data: { url: string };
    createdAt: Timestamp;
}

export default function NotificationScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [notif, setNotif] = useState<notification[]>([]);
    const currUser = auth.currentUser;

    async function loadNotif() {
        const snap = await getDocs(collection(db, "notifications", currUser ? currUser.uid : "", "unread"));

        const data = snap.docs.map(doc => ({
            id: doc.id,
            ...(doc.data()) as Omit<notification, "id">
        }));

        setNotif(data);
        // console.log(data);
    }

    useEffect(() => {
        loadNotif();
    }, [])
    return (
        <View style={{ backgroundColor: "#17171d", flex: 1, paddingTop: insets.top, paddingBottom: 100, alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%", marginBottom: 20 }}>
                <OnlyIconButton icon="arrow-left" func={() => { router.back() }} style={{ top: 0, left: 20, zIndex: 5 }} />
                <CustomText style={{ color: "white", left: 50, fontSize: 18, top: 0, fontWeight: 700 }}>Notifications</CustomText>
            </View>
            <View style={styles.listContainer}>
                <FlashList
                    data={notif}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={<NothingHere />}
                    renderItem={({ item }: ListRenderItemInfo<notification>) => (
                        <NotificationBox
                            title={item.title}
                            message={item.message}
                            data={item.data}
                            createdAt={item.createdAt}
                        />
                    )
                    }
                    estimatedItemSize={100}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        width: "95%",
    }

});