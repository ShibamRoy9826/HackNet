import { auth, db } from "@auth/firebase";
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { addDoc, collection, deleteDoc, doc, getCountFromServer, getDoc, increment, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { Alert, Share, ToastAndroid } from "react-native";
import { sendNotifToUser } from "./notificationUtils";
import { extractUrl } from "./stringTimeUtils";
import { UserData } from "./types";

export async function uploadToHc(urls: string[]) {
    const hc = "https://cdn.hackclub.com/api/v3/new";
    // console.log("This is the data hc upload fn got:", urls);

    const hcRes = await fetch(hc,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.EXPO_PUBLIC_HACKCLUB_CDN_KEY}`
            },
            body: JSON.stringify(urls)
        });

    const response = await hcRes.json();

    if (response) {
        // console.log('response from hc: ', response);
        const deployedUrls = [];
        for (let i = 0; i < response.files.length; ++i) {
            deployedUrls.push(response.files[i].deployedUrl)
        }
        // console.log(deployedUrls);
        return deployedUrls;
    } else {
        return [];
    }
}

export const uploadFileTemp = async (file: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', `https://bashupload.com/${file.fileName}`);

        xhr.onload = async () => {
            try {
                resolve(extractUrl(xhr.responseText))
            } catch (err) {
                reject(err);
            }
        };

        xhr.onerror = () => {
            reject(new Error("upload failed"));
        };

        xhr.setRequestHeader('Content-Type', 'application/octet-stream');
        xhr.send({ uri: file.uri, type: 'application/octet-stream', name: file.fileName });


    })
}


export async function addComment(comment: string, post_id: string, fn?: () => void) {
    const uid = auth.currentUser ? auth.currentUser.uid : "";
    console.log("Trying to add comment as ", uid, " comment: ", comment);
    try {
        await addDoc(collection(db, "posts", post_id, "comments"), {
            uid: uid,
            message: comment,
            timestamp: serverTimestamp(),
            likes: 0
        })
        await updateDoc(doc(db, "posts", post_id),
            {
                num_comments: increment(1)
            })
        if (fn) {
            fn();
        }
    } catch (e) {
        console.log("Couldn't comment: ", e);
    }
}


export function handleSlackLogin() {
    console.log("Tried slack login");
}

// user functions

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
    try {
        await deleteDoc(follow);
        await updateDoc(doc(db, "users", currUser ? currUser.uid : ""),
            {
                num_tracking: increment(-1)
            })
    } catch (e) {
        console.log(e);
    }
}


// post functions
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
    try {
        await deleteDoc(doc(db, "posts", postId))
        await updateDoc(doc(db, "users", currUser ? currUser : ""), {
            num_logs: increment(-1)
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


