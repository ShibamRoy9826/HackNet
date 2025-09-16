import { db } from "@auth/firebase";
import { addDoc, arrayUnion, collection, doc, DocumentData, getDoc, getDocs, runTransaction, updateDoc, writeBatch } from "firebase/firestore";
import { Alert, AlertButton, ToastAndroid } from "react-native";
import { sendNotifToUser } from "./notificationUtils";

export async function sendMessage(text: string, chatId: string, sender: string, receiver: string, senderDisplayName: string) {
    try {
        await addDoc(collection(db, "chats", chatId, "messages"), {
            text: text,
            sender: sender,
            receiver: receiver,
            createdAt: new Date(),
            deletedFor: []
        })

        await updateDoc(doc(db, "chats", chatId), {
            lastMessage: text,
            lastSender: sender,
        })

        sendNotifToUser(`${senderDisplayName} sent you a message`, text, `https://hacknet-web.vercel.app/(tabs)/friends/${chatId}`, receiver, true);

    } catch (e) {
        console.log("Couldn't send message: ", e);
    }
}

async function deleteMessagesForEveryone(chatId: string, messageIds: string[]) {
    const messageRef = collection(db, "chats", chatId, "messages");
    const chatRef = doc(db, "chats", chatId);

    let uids: string[] = [];
    try {
        const uidData = await getDoc(chatRef);
        uids.push(...uidData?.data()?.uids);
        while (true) {
            const snap = await getDocs(messageRef);
            if (snap.empty) break;

            const toProcess = snap.docs.filter(
                doc => {
                    const docData = doc.data();
                    const deletedFor: string[] = docData.deletedFor ?? [];
                    const needsUpdate = uids.some(uid => !deletedFor.includes(uid))
                    const matchedId = messageIds.includes(doc.id);
                    return (needsUpdate) && matchedId;
                }
            )

            if (toProcess.length === 0) break;

            const batch = writeBatch(db);

            toProcess.forEach(doc => {
                batch.delete(doc.ref);
            })
            await batch.commit();
            ToastAndroid.show("Deleted all messages for yourself", 3);
        }
    } catch (e) {
        console.log("error occured", e)
    }

}


async function deleteMessagesForYou(chatId: string, sender: string, messageIds: string[]) {
    const messageRef = collection(db, "chats", chatId, "messages");
    const chatRef = doc(db, "chats", chatId);

    let uids: string[] = [];
    try {
        const uidData = await getDoc(chatRef);
        uids.push(...uidData?.data()?.uids);
        while (true) {
            const snap = await getDocs(messageRef);
            if (snap.empty) break;

            const toProcess = snap.docs.filter(
                doc => {
                    const docData = doc.data();
                    const deletedFor: string[] = docData.deletedFor ?? [];
                    const needsUpdate = !deletedFor.includes(sender);
                    const needsDeletion = uids.every(uid => uid === sender || deletedFor.includes(uid));
                    const matchedId = messageIds.includes(doc.id);
                    return (needsUpdate || needsDeletion) && matchedId;
                }
            )

            if (toProcess.length === 0) break;

            const batch = writeBatch(db);

            toProcess.forEach(doc => {
                const docData = doc.data();
                const deletedFor: string[] = docData.deletedFor ?? [];
                const needsDeletion = uids.every(uid => uid === sender || deletedFor.includes(uid));

                if (!deletedFor.includes(sender)) {
                    batch.update(doc.ref,
                        {
                            deletedFor: arrayUnion(sender)
                        }
                    )
                }
                if (needsDeletion) {
                    batch.delete(doc.ref);
                }
            })
            await batch.commit();
            ToastAndroid.show("Deleted all messages for yourself", 3);
        }
    } catch (e) {
        console.log("error occured", e)
    }

}


export async function deleteSelectedMessages(chatId: string, sender: string, messageIds: string[], setMessageIds: React.Dispatch<React.SetStateAction<string[]>>) {
    const messageRef = collection(db, "chats", chatId, "messages");

    try {
        const data = await getDocs(messageRef);
        const selectedMsgs: DocumentData[] = data.docs.filter(
            (doc) => {
                messageIds.includes(doc.id);
            }
        )
        const includesOther = selectedMsgs.some(() => {
            (msg: DocumentData) => { msg.doc.data().sender !== sender }
        })

        const buttons: AlertButton[] = [
            {
                text: "Cancel", style: 'cancel',
                onPress: () => {
                    setMessageIds([]);
                }
            },
            {
                text: "Delete for myself", onPress: async () => {
                    setMessageIds([]);
                    deleteMessagesForYou(chatId, sender, messageIds);
                }
            }
        ]

        if (!includesOther) {
            buttons.push({
                text: "Delete for everyone",
                onPress: async () => {
                    setMessageIds([]);
                    deleteMessagesForEveryone(chatId, messageIds);
                }
            })
        }

        Alert.alert("Are you sure?", "", buttons)

    } catch (e) {
        console.log("error occured", e)
    }

}

export function deleteAllMessages(chatId: string, sender: string) {
    const messageRef = collection(db, "chats", chatId, "messages");
    const chatRef = doc(db, "chats", chatId);
    let uids: string[] = [];

    Alert.alert("Are you sure sure?", "Be sure if you want to delete all of these messages for yourself",
        [
            { text: "Cancel", style: 'cancel' },
            {
                text: "Yes", onPress: async () => {

                    try {
                        await runTransaction(db, async (transaction) => {
                            const uidData = await transaction.get(chatRef);
                            uids.push(...uidData?.data()?.uids);
                            transaction.update(chatRef,
                                {
                                    lastMessage: "Start a new conversation",
                                    lastSender: "",
                                }
                            )
                        });

                        while (true) {
                            const snap = await getDocs(messageRef);
                            if (snap.empty) break;
                            const toProcess = snap.docs.filter(
                                doc => {
                                    const docData = doc.data();
                                    const deletedFor: string[] = docData.deletedFor ?? [];
                                    const needsUpdate = !deletedFor.includes(sender);
                                    const needsDeletion = uids.every(uid => uid === sender || deletedFor.includes(uid));

                                    return needsUpdate || needsDeletion;
                                }
                            )

                            if (toProcess.length === 0) break;

                            const batch = writeBatch(db);

                            toProcess.forEach(doc => {
                                const docData = doc.data();
                                const deletedFor: string[] = docData.deletedFor ?? [];
                                const needsDeletion = uids.every(uid => uid === sender || deletedFor.includes(uid));

                                if (!deletedFor.includes(sender)) {
                                    batch.update(doc.ref,
                                        {
                                            deletedFor: arrayUnion(sender)
                                        }
                                    )
                                }
                                if (needsDeletion) {
                                    batch.delete(doc.ref);
                                }
                            })
                            await batch.commit();
                        }

                        ToastAndroid.show("Deleted all messages successfully", 3);

                    } catch (e) {
                        console.log("error occured", e)
                    }

                }
            }
        ]
    )
}