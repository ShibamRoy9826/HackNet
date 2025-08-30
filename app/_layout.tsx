// navigation
import { Stack } from "expo-router";

// firebase stuff
import { auth } from "@auth/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

//react and expo
import { useEffect, useState } from 'react';

//contexts
import { ModalProvider } from "@contexts/modalContext";
import { UserDataProvider } from "@contexts/userContext";


export default function RootLayout() {
  // handling loading state
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [])

  if (loading) {
    return (
      <Stack>
        <Stack.Screen name="loading" options={{ headerShown: false }} />
      </Stack>
    )
  }

  return (
    <ModalProvider>
      <UserDataProvider>
        <Stack initialRouteName={"auth/login"} screenOptions={{ contentStyle: { backgroundColor: "#17171d" }, headerShown: false, animation: "fade" }}>
        </Stack>
      </UserDataProvider>
    </ModalProvider>
  );
}
