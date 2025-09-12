//components
import FriendBox from "@components/containers/friend";
import CustomText from "@components/display/customText";
import InputBox from "@components/inputs/inptField";
import OnlyIconButton from "@components/inputs/onlyIconButton";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { StyleSheet, View } from "react-native";

//react
import { useEffect, useState } from "react";

//typecasting
import { auth, db } from "@auth/firebase";
import NothingHere from "@components/display/nothing";
import { friend } from "@utils/types";
import { useRouter } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";



export default function FriendsScreen() {
    const [search, setSearch] = useState("");

    const router = useRouter()
    const currUser = auth.currentUser;
    const [friends, setFriends] = useState<friend[]>();

    useEffect(() => {
        const friendSub = onSnapshot(collection(db, "users", currUser ? currUser.uid : "", "friends"), (snap) => {
            const data: friend[] = snap.docs.map(doc => (
                {
                    id: doc.id,
                    ...(doc.data() as Omit<friend, 'id'>)
                }
            ));
            console.log(data, "contains all friends")
            setFriends(data);

        });
    }, [])
    return (
        <View style={{ backgroundColor: "#17171d", flex: 1, paddingTop: 50, paddingBottom: 100, alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
                <CustomText style={{ color: "white", fontSize: 20, textAlign: "center", fontWeight: "bold", marginVertical: 10, marginLeft: "10%" }}>Your Friends</CustomText>
                <OnlyIconButton
                    icon="account-plus-outline"
                    func={() => { router.push("/(tabs)/friends/friendRequests") }}
                    style={{ marginLeft: "auto", marginRight: 30 }}
                />
            </View>

            <InputBox secure={false} value={search} valueFn={setSearch} color="white" icon="magnify" type="none" placeholder="Search your friends here" />
            <View style={styles.listContainer}>
                <FlashList
                    data={friends}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={<NothingHere />}
                    renderItem={({ item }: ListRenderItemInfo<friend>) => (
                        // <CustomText>{item.id}</CustomText>
                        <FriendBox
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
        marginVertical: 25,
        borderRadius: 12,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#444456ff",
        flex: 1
    }

});