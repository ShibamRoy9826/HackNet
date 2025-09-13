import { UserData } from "@utils/types";
import React, { createContext, useContext, useState } from "react";

type dataContext = {
    UserProfileData: UserData | undefined,
    setUserProfileData: (a: UserData | undefined) => void
}
const dataContext = createContext<dataContext | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [UserProfileData, setUserProfileData] = useState<UserData | undefined>(undefined);
    return (
        <dataContext.Provider value={
            {
                UserProfileData: UserProfileData,
                setUserProfileData: setUserProfileData
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