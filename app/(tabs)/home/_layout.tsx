// navigation
import { Stack } from "expo-router";

export default function HomeLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#17171d" } }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="settings" options={{ title: "Settings", headerShown: true, headerTintColor: "white", headerStyle: { backgroundColor: "#17171d" } }} />
        </Stack >
    );
}
