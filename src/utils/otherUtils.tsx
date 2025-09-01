import { auth, db } from "@auth/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, increment, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
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



// post functions
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
        await updateDoc(doc(db, "posts", postId),
            {
                likes: increment(1)
            })

    } catch (e) {
        console.log(e);
    }
}

export async function dislikePost(postId: string, userUid: string) {
    try {
        await deleteDoc(doc(db, "posts", postId, "likes", userUid));
        updateDoc(doc(db, "posts", postId),
            {
                likes: increment(-1)
            })
    } catch (e) {
        console.log(e);
    }
}
