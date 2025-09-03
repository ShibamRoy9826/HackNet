// navigation
import { Stack } from "expo-router";

//contexts
import { BottomSheetProvider } from "@contexts/BottomSheetContext";
import { ModalProvider } from "@contexts/modalContext";
import { UserDataProvider } from "@contexts/userContext";

//react
import { useEffect, useState } from "react";

//auth
import { auth } from "@auth/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import LoadingScreen from "./loading";


export default function RootLayout() {
  // handling loading state
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoaded(true);
    });
    return () => unsubscribe();
  }, [])

  useEffect(() => {
    if (!loaded) {
    }
  }, [loaded, user])

  if (!loaded) {
    return <LoadingScreen />
  }

  return (
    <GestureHandlerRootView>
      <BottomSheetProvider>
        <ModalProvider>
          <UserDataProvider>
            <Stack initialRouteName={"auth/login"} screenOptions={{ contentStyle: { backgroundColor: "#17171d" }, headerShown: false, animation: "fade" }}>
            </Stack>
          </UserDataProvider>
        </ModalProvider>
      </BottomSheetProvider>
    </GestureHandlerRootView>
  );
}