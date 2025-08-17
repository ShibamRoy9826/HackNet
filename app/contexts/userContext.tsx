import React, { createContext, useContext, useState, useEffect } from "react";
import { onSnapshot, doc, Timestamp } from "firebase/firestore";
import { auth, db } from "../auth/firebase";

type UserData = {
  bio?: string;
  avatar?: string;
  email?: string;
  num_logs?: number;
  num_trackers?: number;
  num_tracking?: number;
  displayName?: string;
  createdAt?: Timestamp;
  friends?: string[];
};

type UserContextType = {
  userData: UserData | null;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

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
