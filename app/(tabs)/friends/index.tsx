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
import { useTheme } from "@contexts/themeContext";
import { chat } from "@utils/types";
import { useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";



export default function FriendsScreen() {
    const [search, setSearch] = useState("");

    const router = useRouter()
    const currUser = auth.currentUser;
    const [chats, setChats] = useState<chat[]>();

    useEffect(() => {
        const chatSub = onSnapshot(query(
            collection(db, "chats"),
            where("uids", "array-contains", currUser ? currUser.uid : ""))
            , (snap) => {
                const data: chat[] = snap.docs.map(doc => (
                    {
                        id: doc.id,
                        ...(doc.data() as Omit<chat, 'id'>)
                    }
                ));
                setChats(data);
            });
    }, [])
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        listContainer: {
            width: '95%',
            marginVertical: 25,
            borderRadius: 12,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
            flex: 1
        }

    });

    function extractSender(uids: string[]) {
        let sender = "";
        for (let i = 0; i < uids.length; ++i) {
            if (uids[i] !== (currUser ? currUser.uid : "")) {
                sender = uids[i];
            }
        }
        return sender;
    }
    return (
        <View style={{ backgroundColor: colors.background, flex: 1, paddingTop: 50, paddingBottom: 100, alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
                <CustomText style={{ color: colors.text, fontSize: 20, textAlign: "center", fontWeight: "bold", marginVertical: 10, marginLeft: "10%" }}>Your Friends</CustomText>
                <OnlyIconButton
                    icon="account-plus-outline"
                    func={() => { router.push("/(tabs)/friends/friendRequests") }}
                    style={{ marginLeft: "auto", marginRight: 30 }}
                />
            </View>

            <InputBox secure={false} value={search} valueFn={setSearch} color={colors.text} icon="magnify" type="none" placeholder="Search your friends here" />
            <View style={styles.listContainer}>
                <FlashList
                    data={chats}
                    keyExtractor={item => item.id}
                    ListEmptyComponent={<NothingHere />}
                    renderItem={({ item }: ListRenderItemInfo<chat>) => (
                        <FriendBox
                            chatId={item.id}
                            uid={extractSender(item.uids)}
                            updatedAt={item.updatedAt}
                            lastMessage={item.lastMessage}
                            lastSender={item.lastSender}
                        />
                    )
                    }
                    estimatedItemSize={100}
                />

            </View>
        </View>
    );
}
