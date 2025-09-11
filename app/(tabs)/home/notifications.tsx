//components
import { auth, db } from "@auth/firebase";
import CustomText from "@components/display/customText";
import NothingHere from "@components/display/nothing";
import NotificationBox from "@components/display/notification";
import OnlyIconButton from "@components/inputs/onlyIconButton";
import RadioBtn from "@components/inputs/radioBtn";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { notification } from "@utils/types";
import { useRouter } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function NotificationScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [readNotif, setReadNotif] = useState<notification[]>([]);
    const [unreadNotif, setUnreadNotif] = useState<notification[]>([]);
    const [currTab, setCurrTab] = useState<string>("Unread");
    const currUser = auth.currentUser;


    useEffect(
        () => {
            const readNotifSub = onSnapshot(collection(db, "notifications", currUser ? currUser.uid : "", "read"), (snap) => {
                const data: notification[] = snap.docs.map(doc => (
                    {
                        id: doc.id,
                        ...(doc.data() as Omit<notification, 'id'>)
                    }
                ));
                console.log(data);
                setReadNotif(data);
            });


            const unreadNotifSub = onSnapshot(collection(db, "notifications", currUser ? currUser.uid : "", "unread"), (snap) => {
                const data: notification[] = snap.docs.map(doc => (
                    {
                        id: doc.id,
                        ...(doc.data() as Omit<notification, 'id'>)
                    }
                ));

                setUnreadNotif(data);

            });
        }, []
    )


    return (
        <View style={{ backgroundColor: "#17171d", flex: 1, paddingTop: insets.top, paddingBottom: 100, alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%", marginBottom: 10 }}>
                <OnlyIconButton icon="arrow-left" func={() => { router.back() }} style={{ top: 0, left: 20, zIndex: 5 }} />
                <CustomText style={{ color: "white", left: 50, fontSize: 18, top: 0, fontWeight: 700 }}>Notifications</CustomText>
            </View>
            <RadioBtn
                options={["Unread", "Read"]}
                iconList={["email-mark-as-unread", "sticker-check"]}
                selected={currTab}
                setSelected={setCurrTab}
                style={{ width: "100%", alignItems: "center", justifyContent: "center" }}
            />
            <View style={styles.listContainer}>

                <FlashList
                    data={(currTab == "Unread") ? unreadNotif : readNotif}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={<NothingHere />}
                    renderItem={({ item }: ListRenderItemInfo<notification>) => (
                        <NotificationBox
                            status={currTab == "Unread" ? "unread" : "read"}
                            id={item.id}
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
        borderTopWidth: 1,
        borderTopColor: "#5f6977ff",
        paddingTop: 10
    }

});