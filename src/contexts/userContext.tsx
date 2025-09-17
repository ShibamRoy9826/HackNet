import { auth, db } from "@auth/firebase";
import { UserData } from "@utils/types";
import { doc, onSnapshot } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";

type UserContextType = {
  userData: UserData | null;
};

const UserContext = createContext<UserContextType | null>(null);


export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (!auth.currentUser) {
      setUserData(null);
      return;
    };

    const unsub = onSnapshot(
      doc(db, "users", auth.currentUser.uid),
      (docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data() as UserData);
        }
      }
    );

    return () => unsub();
  }, []);
  return (
    <UserContext.Provider value={{ userData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
