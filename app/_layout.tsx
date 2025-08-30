// navigation
import { Stack } from "expo-router";


//contexts
import { ModalProvider } from "@contexts/modalContext";
import { UserDataProvider } from "@contexts/userContext";


export default function RootLayout() {

  return (
    <ModalProvider>
      <UserDataProvider>
        <Stack initialRouteName={"index"} screenOptions={{ contentStyle: { backgroundColor: "#17171d" }, headerShown: false, animation: "fade" }}>
        </Stack>
      </UserDataProvider>
    </ModalProvider>
  );
}
