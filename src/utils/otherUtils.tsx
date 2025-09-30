import { db } from "@auth/firebase";
import axios from 'axios';
import { ImagePickerAsset } from "expo-image-picker";
import { addDoc, collection } from "firebase/firestore";
import { ToastAndroid } from "react-native";

export async function uploadToHc(urls: string[]) {
    const hc = "https://cdn.hackclub.com/api/v3/new";

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
        const deployedUrls = [];
        for (let i = 0; i < response.files.length; ++i) {
            deployedUrls.push(response.files[i].deployedUrl)
        }
        return deployedUrls;
    } else {
        return [];
    }
}


// This was the only function made with help of AI, I tried at least a 100 different ways to make it work.
// Each time a new error came and I almost died with frustration.
export const uploadFileTemp = async (file: ImagePickerAsset): Promise<string> => {
    const formData = new FormData();

    formData.append("reqtype", "fileupload");
    formData.append("fileToUpload", {
        uri: file.uri,
        type: file.mimeType ?? "image/jpeg",
        name: file.fileName ?? "upload.jpg",
    } as any);

    const response = await axios.post("https://catbox.moe/user/api.php", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data.trim();
};


/// OLD CODE WITH BASHUPLOAD
// return new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
//     xhr.open('PUT', `https://bashupload.com/${file.fileName}`);

//     xhr.onload = async () => {
//         try {
//             resolve(extractUrl(xhr.responseText))
//         } catch (err) {
//             reject(err);
//         }
//     };

//     xhr.onerror = () => {
//         reject(new Error("upload failed"));
//     };

//     xhr.setRequestHeader('Content-Type', 'application/octet-stream');
//     xhr.send({ uri: file.uri, type: 'application/octet-stream', name: file.fileName });


// })



export function handleSlackLogin() {
    console.log("Tried slack login");
}

export async function report(type: string, objectId: string | string[], reportedBy: string, accused: string) {
    try {
        await addDoc(collection(db, "reports"), {
            type: type,
            objectId: objectId,
            reportedBy: reportedBy,
            accused: accused,
            reportedAt: new Date()
        });
        console.log("reported ", accused, " by ", reportedBy)
        ToastAndroid.show("Reported successfully, thanks for reporting!", 3);

    } catch (e) {
        console.log(`Couldn't report ${type}: `, objectId, e);
    }
}