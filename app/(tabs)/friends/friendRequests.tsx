import { auth, db } from "@auth/firebase";
import FriendRequest from "@components/containers/friendRequest";
import CustomText from "@components/display/customText";
import NothingHere from "@components/display/nothing";
import OnlyIconButton from "@components/inputs/onlyIconButton";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { friendRequest } from "@utils/types";
import { useRouter } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FriendRequests() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const currUser = auth.currentUser;
    const [requests, setRequests] = useState<friendRequest[]>([]);

    useEffect(() => {
        const friendRequestSub = onSnapshot(collection(db, "users", currUser ? currUser.uid : "", "friendRequests"), (snap) => {
            const data: friendRequest[] = snap.docs.map(doc => (
                {
                    id: doc.id,
                    ...(doc.data() as Omit<friendRequest, 'id'>)
                }
            ));
            setRequests(data);

        });
    }, [])

    return (
        <View style={{ backgroundColor: "#17171d", flex: 1, paddingTop: insets.top, paddingBottom: 100, alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%", marginBottom: 20 }}>
                <OnlyIconButton icon="arrow-left" func={() => { router.back() }} style={{ top: 0, left: 20, zIndex: 5 }} />
                <CustomText style={{ color: "white", left: 50, fontSize: 18, top: 0, fontWeight: 700 }}>Friend Requests</CustomText>
            </View>
            <View style={styles.listContainer}>
                <FlashList
                    data={requests}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={<NothingHere />}
                    renderItem={({ item }: ListRenderItemInfo<friendRequest>) => (
                        <FriendRequest
                            id={item.id}
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
        width: '95%',
        marginVertical: 5,
        borderRadius: 12,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#444456ff",
        flex: 1,
    },
    text: {
        color: "white",
        fontSize: 15,
    },
    textValue: {
        color: "#8492a6",
        fontSize: 15,
    },
    heading: {
        color: "#8492a6",
        fontSize: 20,
        fontWeight: 700,
        marginVertical: 10,
    },
    field: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10
    },
    section: {
        padding: 20,
        backgroundColor: "#25252f",
        borderWidth: 1,
        borderColor: "#17171d",
        width: "100%"
    }
});