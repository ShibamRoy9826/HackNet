import { auth, db } from "@auth/firebase";
import { collection, deleteDoc, doc, getDoc, increment, runTransaction, setDoc, updateDoc } from "firebase/firestore";
import { ToastAndroid } from "react-native";
import { sendNotifToUser } from "./notificationUtils";
import { UserData } from "./types";

export async function checkFollow(userId: string) {
    const currUser = auth.currentUser;
    const followRef = doc(db, "users", userId, "trackers", currUser ? currUser.uid : "");
    try {
        const followSnap = await getDoc(followRef);
        const follow = followSnap.exists();
        return follow;
    }
    catch (e) {
        console.log(e, " there's an error...");
        return false;
    }

}
export async function followUser(userId: string) {
    const currUser = auth.currentUser;
    const follow = doc(db, "users", userId, "trackers", currUser ? currUser.uid : "");
    const userToFollow = doc(db, "users", userId)
    let userData;
    try {
        await setDoc(follow,
            {
                trackedAt: new Date()
            }
        );
        await updateDoc(doc(db, "users", currUser ? currUser.uid : ""),
            {
                num_tracking: increment(1)
            })

        const d = await getDoc(userToFollow);
        userData = d.data() as UserData;
    }
    catch (e) {
        console.log(e, " there's an error...");
    }

    sendNotifToUser("You've got a new tracker!", `${currUser?.displayName} started tracking your journey, track them back if you don't already!`, `https://hacknet-web.vercel.app/(modals)/profile/${currUser?.uid}`, userId)
}

export async function unfollowUser(userId: string) {
    const currUser = auth.currentUser;
    const follow = doc(db, "users", userId, "trackers", currUser ? currUser.uid : "")
    const currUserProfile = doc(db, "users", currUser ? currUser.uid : "")
    try {
        await runTransaction(db, async (transaction) => {
            transaction.delete(follow);
            transaction.update(currUserProfile, {
                num_tracking: increment(-1)
            })
        });
    } catch (e) {
        console.log(e);
    }
}


export async function sendFriendRequest(sender: string, receiver: string) {
    const requestRef = doc(db, "users", receiver, "friendRequests", sender)
    try {
        await runTransaction(db, async (transaction) => {
            const req = transaction.get(requestRef)
            if ((await req).exists()) {
                ToastAndroid.show("You already sent a friend request to them", 3)
            } else {
                transaction.set(
                    requestRef,
                    {
                        createdAt: new Date()
                    }
                )

                ToastAndroid.show("Sent friend request, hope they accept you soon!", 3)

            }
        });
    } catch (e) {
        console.log("Couldn't send friend request", e)
    }
}

export async function acceptRequest(sender: string, receiver: string) {
    const receiverRequestRef = doc(db, "users", receiver, "friendRequests", sender)
    const receiverRef = doc(db, "users", receiver, "friends", sender);
    const senderRef = doc(db, "users", sender, "friends", receiver);

    const chatRef = collection(db, "chats");

    try {
        await runTransaction(db, async (transaction) => {
            const newChatRef = doc(chatRef);
            transaction.set(newChatRef, {
                uids: [sender, receiver],
                lastMessage: "Start a new conversation",
                lastSender: "",
                updatedAt: new Date(),
            })
            transaction.set(receiverRef, { createdAt: new Date() });
            transaction.set(senderRef, { createdAt: new Date() });
            transaction.delete(receiverRequestRef);
        })

        ToastAndroid.show("You just made a new friend, congrats:)", 3)
    } catch (e) {
        console.log("Couldn't accept friend request", e)
    }

}

export async function rejectRequest(sender: string, receiver: string) {
    try {
        await deleteDoc(
            doc(db, "users", receiver, "friendRequests", sender)
        )
        ToastAndroid.show("Rejected successfully", 3)

    } catch (e) {
        console.log("Couldn't reject friend request", e)
    }
}

export async function unfriend(sender: string, receiver: string, chatId: string) {
    try {

        await runTransaction(db, async (transaction) => {
            transaction.delete(doc(db, "users", receiver, "friends", sender));
            transaction.delete(doc(db, "users", sender, "friends", receiver));
            transaction.delete(doc(db, "chats", chatId));
        })
        ToastAndroid.show("Unfriended successfully", 3)
    } catch (e) {
        console.log("Couldn't remove friend", e)
    }
}
