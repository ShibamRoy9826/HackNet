import { auth, db } from "@auth/firebase";
import { addDoc, collection, deleteDoc, doc, getCountFromServer, getDoc, increment, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { extractUrl } from "./stringTimeUtils";

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
    console.log("Trying to follow");
    try {
        console.log("About to created doc");
        await setDoc(follow,
            {
                trackedAt: new Date()
            }
        );
        await updateDoc(doc(db, "users", currUser ? currUser.uid : ""),
            {
                num_tracking: increment(1)
            })
    }
    catch (e) {
        console.log(e, " there's an error...");
    }
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
