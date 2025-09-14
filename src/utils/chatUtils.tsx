import { db } from "@auth/firebase";
import { addDoc, arrayUnion, collection, doc, getDocs, updateDoc, writeBatch } from "firebase/firestore";

export async function sendMessage(text: string, chatId: string, sender: string, receiver: string) {
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
    } catch (e) {
        console.log("Couldn't send message: ", e);
    }
}
export async function deleteAllMessages(chatId: string, sender: string) {
    const messageRef = collection(db, "chats", chatId, "messages");

    try {
        await updateDoc(doc(db, "chats", chatId), {
            lastMessage: "Start a new conversation",
            lastSender: "",
        })
        while (true) {
            const snap = await getDocs(messageRef);

            const toUpdate = snap.docs.filter(d => !d.data().deletedFor?.includes(sender));
            console.log(toUpdate.length, " is the len and ", snap.docs.length);
            if (toUpdate.length === 0) break;

            const batch = writeBatch(db);
            toUpdate.slice(0, 500).forEach((doc) => {
                // console.log(doc.ref, " is the doc")
                batch.update(doc.ref, {
                    deletedFor: arrayUnion(sender)
                });
            });

            await batch.commit();
        }

    } catch (e) {
        console.log("error occured", e)
    }
}