import { extractUrl } from "./stringTimeUtils";

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



export function handleSlackLogin() {
    console.log("Tried slack login");
}
