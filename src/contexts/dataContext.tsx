import { friendRequest, UserData } from "@utils/types";
import React, { createContext, useContext, useEffect, useState } from "react";

type dataContext = {
    UserProfileData: UserData | undefined,
    setUserProfileData: (a: UserData | undefined) => void,
    selectionMode: boolean,
    setSelectionMode: (a: boolean) => void,
    setMessageIds: React.Dispatch<React.SetStateAction<string[]>>,
    messageIds: string[],
    friendRequests: friendRequest[],
    setFriendRequests: React.Dispatch<React.SetStateAction<friendRequest[]>>
}
const dataContext = createContext<dataContext | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [UserProfileData, setUserProfileData] = useState<UserData | undefined>(undefined);

    const [selectionMode, setSelectionMode] = useState(false);
    const [messageIds, setMessageIds] = useState<string[]>([]);

    const [friendRequests, setFriendRequests] = useState<friendRequest[]>([]);

    useEffect(() => {
        if (messageIds.length == 0) {
            setSelectionMode(false);
        }
    }, [messageIds])

    return (
        <dataContext.Provider value={
            {
                UserProfileData: UserProfileData,
                setUserProfileData: setUserProfileData,
                selectionMode: selectionMode,
                setSelectionMode: setSelectionMode,
                setMessageIds: setMessageIds,
                messageIds: messageIds,
                friendRequests: friendRequests,
                setFriendRequests: setFriendRequests
            }
        }>
            {children}
        </dataContext.Provider>
    )
}


export function useDataContext() {
    const context = useContext(dataContext);
    if (!context) {
        throw new Error("useUser must be used within a ThemeProvider");
    }
    return context;
}