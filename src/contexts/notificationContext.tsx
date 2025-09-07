import { registerForPushNotificationsAsync } from "@utils/notificationUtils";
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import React, { createContext, useContext, useEffect, useState } from "react";

type notificationContextType = {
    expoPushToken: string;
    notification: Notifications.Notification | undefined;
}
const NotificationContext = createContext<notificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(

        undefined
    );
    useEffect(() => {
        registerForPushNotificationsAsync()
            .then(token => setExpoPushToken(token ?? ''))
            .catch((error: any) => setExpoPushToken(`${error}`));

        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            const url = response.notification.request.content.data?.url as string;
            if (url) {
                Linking.openURL(url);
            }
        });

        return () => {
            notificationListener.remove();
            responseListener.remove();
        };
    }, []);

    return (
        <NotificationContext.Provider value={
            {
                expoPushToken,
                notification
            }
        }>
            {children}
        </NotificationContext.Provider>
    )
}


export function useNotificationContext() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useUser must be used within a ModalContext");
    }
    return context;
}