import { db } from '@auth/firebase';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { UserData } from './types';

export async function sendNotifToUser(
    title: string,
    msg: string,
    url: string,
    uid: string
) {

    const userToFollow = doc(db, "users", uid)
    let userData;
    try {

        const d = await getDoc(userToFollow);
        userData = d.data() as UserData;
    }
    catch (e) {
        console.log(e, " there's an error...");
    }
    const expoPushToken = userData ? (userData.notificationToken ? userData.notificationToken : "") : ""

    const message = {
        to: expoPushToken,
        sound: 'notification_ping.mp3',
        title: title,
        body: msg,
        data: { url: url }
    };

    try {
        await setDoc(doc(db, "notifications", uid), { exists: true }, { merge: true });

        await addDoc(collection(db, "notifications", uid, "unread"), {
            uid: uid,
            message: msg,
            title: title,
            data: { url: url },
            createdAt: Date.now()
        });

        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

    } catch (e: unknown) {
        console.log("noooooo !! errrrrr occured... :", e)
    }

}

export async function sendPushNotification(
    title: string,
    msg: string,
    url: string,
    expoPushToken: string
) {
    const message = {
        to: expoPushToken,
        sound: 'notification_ping.mp3',
        title: title,
        body: msg,
        data: { url: url }
    };
    // console.log(title, msg, url, expoPushToken);

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}


export function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

export async function registerForPushNotificationsAsync() {
    await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        sound: "notification_ping.mp3",
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
    });

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            handleRegistrationError('Permission not granted to get push token for push notification!');
            return;
        }
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            handleRegistrationError('Project ID not found');
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            // console.log(pushTokenString);
            return pushTokenString;
        } catch (e: unknown) {
            handleRegistrationError(`${e}`);
        }
    } else {
        handleRegistrationError('Must use physical device for push notifications');
    }
}

