import { extractUrl } from "./stringTimeUtils";
import { increment, doc, addDoc, collection, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/auth/firebase";

export async function uploadToHc(urls: string[]) {
    const hc = "https://cdn.hackclub.com/api/v3/new";
    console.log("This is the data hc upload fn got:", urls);

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
        console.log('response from hc: ', response);
        const deployedUrls = [];
        for (let i = 0; i < response.files.length; ++i) {
            deployedUrls.push(response.files[i].deployedUrl)
        }
        console.log(deployedUrls);
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


export async function addComment(comment: string, post_id: string, uid: string, fn?: () => void) {
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