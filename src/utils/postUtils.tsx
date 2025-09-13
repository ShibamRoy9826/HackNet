import { auth, db } from "@auth/firebase";
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { collection, deleteDoc, doc, getCountFromServer, getDoc, increment, runTransaction, setDoc } from "firebase/firestore";
import { Alert, Share, ToastAndroid } from "react-native";

export async function getLikeCount(postId: string) {
    const col = collection(db, "posts", postId, "likes");
    const likeCount = await getCountFromServer(col);
    return likeCount.data().count;
}

export async function checkUserLiked(postId: string, userUid: string) {
    const likeRef = doc(db, "posts", postId, "likes", userUid);
    try {
        const likeSnap = await getDoc(likeRef);
        const liked = likeSnap.exists();
        return liked;
    }
    catch (e) {
        console.log(e, " there's an error...");
        return false;
    }
}

export async function likePost(postId: string, userUid: string) {
    try {
        await setDoc(doc(db, "posts", postId, "likes", userUid),
            {
                createdAt: new Date()
            }
        )
        return await getLikeCount(postId);
    } catch (e) {
        console.log(e);
        return 0;
    }
}

export async function dislikePost(postId: string, userUid: string) {
    try {
        await deleteDoc(doc(db, "posts", postId, "likes", userUid));
        return await getLikeCount(postId);
    } catch (e) {
        console.log(e);
        return 0;
    }
}

export async function deletePost(postId: string) {
    const currUser = auth.currentUser?.uid;
    const postRef = doc(db, "posts", postId);
    const userRef = doc(db, "users", currUser ? currUser : "")
    try {
        await runTransaction(db, async (transaction) => {
            transaction.delete(postRef);
            transaction.update(userRef, { num_logs: increment(-1) });
        })
    } catch (e) {
        console.log("Couldn't delete post", e);
    }
}

export async function sharePost(id: string) {
    const redirectUrl = Linking.createURL(`/comments/${id}`);
    const cleanedUrl = redirectUrl.replace("hacknet:///", "https://hacknet-web.vercel.app/")
    try {
        await Share.share({
            message: `Check out this post! ${cleanedUrl}`
        });
    } catch (e: any) {
        if (e) {
            console.log(e.message)
        }
    }
}
export async function shareToClipboard(id: string) {
    const redirectUrl = Linking.createURL(`/comments/${id}`);
    const cleanedUrl = redirectUrl.replace("hacknet:///", "https://hacknet-web.vercel.app/")
    Clipboard.setStringAsync(cleanedUrl);
    ToastAndroid.show("Copied URL to clipboard", 3);
}

export async function sharePostToWhatsapp(id: string) {
    const redirectUrl = Linking.createURL(`/comments/${id}`);
    const cleanedUrl = redirectUrl.replace("hacknet:///", "https://hacknet-web.vercel.app/")
    const msg = `Check out this post! ${cleanedUrl}`;
    const url = `whatsapp://send?text=${encodeURIComponent(msg)}`;

    Linking.canOpenURL(url).then(async () => {
        await Linking.openURL(url);
    }).catch((e) => {
        Alert.alert("Whatsapp is probably not installed...");
    });
}


export async function sharePostToFacebook(id: string) {
    const redirectUrl = Linking.createURL(`/comments/${id}`);
    const cleanedUrl = redirectUrl.replace("hacknet:///", "https://hacknet-web.vercel.app/")
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cleanedUrl)}`;

    Linking.canOpenURL(url).then(async () => {
        await Linking.openURL(url);
    }).catch((e) => {
        Alert.alert("Facebook is probably not installed...");
    });
}

export async function sharePostToReddit(id: string) {
    const redirectUrl = Linking.createURL(`/comments/${id}`);
    const cleanedUrl = redirectUrl.replace("hacknet:///", "https://hacknet-web.vercel.app/")
    const url = `reddit://submit?url=${encodeURIComponent(cleanedUrl)}&title=Check+Out+This+Post:&type=LINK`;
    const fallBackurl = `https://www.reddit.com/submit?url=${encodeURIComponent(cleanedUrl)}&title=Check+Out+This+Post:&type=LINK`;

    Linking.canOpenURL(url).then(async () => {
        await Linking.openURL(url);
    }).catch(async (e) => {
        await Linking.openURL(fallBackurl);
    });
}
