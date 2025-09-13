import { db } from "@auth/firebase";
import { addDoc, collection } from "firebase/firestore";

export async function sendMessage(text: string, chatId: string, sender: string, receiver: string) {
    try {
        await addDoc(collection(db, "chats", chatId, "messages"), {
            text: text,
            sender: sender,
            receiver: receiver,
            createdAt: new Date(),
        })
    } catch (e) {
        console.log("Couldn't send message: ", e);
    }
}