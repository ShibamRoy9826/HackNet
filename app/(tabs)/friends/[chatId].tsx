
//components
import Message from "@components/display/message";
import OnlyIconButton from "@components/inputs/onlyIconButton";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, KeyboardAvoidingView, Pressable, StyleSheet, View } from "react-native";

//others
import { useDataContext } from "@contexts/dataContext";
import { useTheme } from "@contexts/themeContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//navigation
import { auth, db } from "@auth/firebase";
import CustomText from "@components/display/customText";
import ThreeDots from "@components/display/threeDots";
import InputBox from "@components/inputs/inptField";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { FlashList, ListRenderItem, ListRenderItemInfo } from "@shopify/flash-list";
import { deleteAllMessages, deleteSelectedMessages, sendMessage } from "@utils/chatUtils";
import { report } from "@utils/otherUtils";
import { message } from "@utils/types";
import { unfriend } from "@utils/userUtils";
import { useAudioPlayer } from "expo-audio";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";


export default function ChatScreen() {
    const { chatId } = useLocalSearchParams<{ chatId: string }>();
    const { colors } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const user = auth.currentUser;

    const { UserProfileData } = useDataContext();

    const [messages, setMessages] = useState<message[]>([]);
    const [message, setMessage] = useState("")
    const incomingSrc = require("@assets/sounds/message.mp3")
    const incoming = useAudioPlayer(incomingSrc);

    const sentSrc = require("@assets/sounds/selfMessage.mp3")
    const sent = useAudioPlayer(sentSrc);

    const { selectionMode, setSelectionMode, setMessageIds, messageIds } = useDataContext();

    const [initialLoaded, setInitialLoaded] = useState(false);

    const listRef = useRef<FlashList<any>>(null);

    const styles = StyleSheet.create({
        listContainer: {
            height: "100%",
            width: "100%",
            flex: 1,
            paddingTop: 10,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: colors.border,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: colors.border,
            position: "relative"

        },
        emptyContainer: {
            flex: 1
        },
    })

    function handleSend() {
        sendMessage(message,
            chatId,
            user ? user.uid : "",
            UserProfileData ? UserProfileData.uid : "",
            UserProfileData ? (UserProfileData.displayName ? UserProfileData.displayName : "") : "");
        setMessage("");
    }

    const renderMessage: ListRenderItem<message> = useCallback(({ item }: ListRenderItemInfo<message>) =>
    (
        <Message
            message={item}
        />

    ), [])

    useEffect(() => {
        const chatSub = onSnapshot(
            query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc")),
            (snap) => {

                const data: message[] = snap.docs.map(doc => (
                    {
                        id: doc.id,
                        ...(doc.data() as Omit<message, 'id'>)
                    }
                )).filter(msg => !(msg.deletedFor?.includes(user ? user.uid : "")));

                if (initialLoaded) {
                    const lastMsg = data[data.length - 1];

                    AsyncStorage.getItem("messageSound").then(
                        (value) => {
                            if (lastMsg.sender === (user?.uid)) {
                                if (value === "true") {
                                    sent.seekTo(0);
                                    sent.play();
                                }
                            }
                            else {
                                if (value === "true") {
                                    incoming.seekTo(0);
                                    incoming.play();
                                }

                            }
                        }

                    )
                }

                if (listRef.current) {
                    listRef.current?.scrollToIndex({ animated: true, index: data.length - 1 })
                }
                setInitialLoaded(true);
                setMessages(data);
            });
    }, [])


    return (
        <KeyboardAvoidingView behavior="height" style={{ backgroundColor: colors.background, flex: 1, paddingTop: insets.top, marginBottom: 100, alignItems: "center" }}>
            <View style={{ position: "relative", flexDirection: "row", alignItems: "center", width: "100%" }}>
                <OnlyIconButton icon="arrow-left" func={() => { router.back(); setSelectionMode(false) }} style={{ top: 0, left: 20, zIndex: 5 }} />
                <CustomText style={{ color: colors.text, left: 30, fontSize: 18, top: 0, fontWeight: 700 }}>{UserProfileData?.displayName}</CustomText>
                <View style={{ flexDirection: "row", position: "absolute", right: 10, top: 10, alignItems: "center" }}>
                    {
                        selectionMode ?
                            <Pressable onPress={() => {
                                setSelectionMode(false); setMessageIds([]);
                                deleteSelectedMessages(chatId, user ? user.uid : "", messageIds, setMessageIds);
                            }} style={{ zIndex: 5, padding: 5, borderRadius: 5, right: 10 }}>
                                <MaterialDesignIcons name="delete" color={colors.muted} size={25} />
                            </Pressable>
                            : null
                    }

                    <ThreeDots
                        data={[
                            ...(selectionMode ?
                                [{
                                    text: "Deleselect All", icon: "checkbox-blank-outline", func: () => {
                                        setSelectionMode(false); setMessageIds([])
                                    }
                                } as const,
                                {
                                    text: "Delete selected messages", icon: "delete", func: () => {
                                        setSelectionMode(false);
                                        deleteSelectedMessages(chatId, user ? user.uid : "", messageIds, setMessageIds);
                                    }
                                } as const]
                                : [{
                                    text: "Select messages", icon: "checkbox-marked", func: () => {
                                        setSelectionMode(true);
                                    }
                                } as const]
                            )
                            ,
                            {
                                text: "Clear all chats", icon: "shredder", func: () => {
                                    deleteAllMessages(chatId, user ? user.uid : "");
                                }
                            },
                            {
                                text: "Unfriend", icon: "heart-broken", func: () => {
                                    unfriend(UserProfileData ? UserProfileData.uid : "", user ? user.uid : "", chatId)
                                }
                            },
                            {
                                text: "Report", icon: "exclamation", func: () => {
                                    Alert.alert("Are you sure?", "Please don't make false reports, be sure before doing a report",
                                        [
                                            {
                                                text: "Yes",
                                                onPress: () => {
                                                    report("message", messageIds, user ? user.uid : "", UserProfileData ? UserProfileData.uid : "")
                                                }
                                            },
                                            {
                                                text: "No",
                                                style: "cancel"
                                            }
                                        ]
                                    )
                                }
                            }
                        ]}
                    />
                </View>
            </View>


            <View style={styles.listContainer}>
                <FlashList
                    ref={listRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    //Not encrypted yet:(
                    // ListHeaderComponent={
                    //     (messages.length === 0) ?
                    //         <View style={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
                    //             <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "center" }}>
                    //                 <CustomText style={{ color: colors.muted, backgroundColor: colors.secondaryBackground, borderRadius: 10, padding: 6 }}>
                    //                     Chats are end-to-end Encrypted
                    //                 </CustomText>
                    //                 <MaterialDesignIcons name="lock" size={20} color={colors.muted} style={{ marginLeft: 5, marginVertical: 15 }} />
                    //             </View>
                    //         </View> : null
                    // }
                    ListFooterComponent={<View style={{ marginBottom: 100 }}></View>}
                    ListEmptyComponent={
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: "center", padding: 50 }}>
                            <CustomText style={{ color: colors.smallText }}>{`Say 'hello' to ${UserProfileData?.displayName}`}</CustomText>
                        </View>
                    }
                    estimatedItemSize={200}
                />

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <InputBox secure={false} value={message} valueFn={setMessage} color={colors.text} icon="message" type="none" placeholder="Send a message" />
                    <Pressable style={{ padding: 8 }} onPress={handleSend} >
                        <MaterialDesignIcons name="send" color={colors.muted} size={25} />
                    </Pressable>
                </View>
            </View>

        </KeyboardAvoidingView>
    );
}
