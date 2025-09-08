// navigation
import { Stack } from "expo-router";

export default function HomeLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#17171d" } }}>
            <Stack.Screen name="index" options={{ contentStyle: { backgroundColor: "#17171d" } }} />
            <Stack.Screen name="settings" options={{
                contentStyle: { backgroundColor: "#17171d" },
                presentation: "modal",
                title: "Settings"
            }} />

            <Stack.Screen name="notifications" options={{
                contentStyle: { backgroundColor: "#17171d" },
                presentation: "modal",
                title: "Notifications",
                headerShown: true,
                headerTintColor: "white",
                headerStyle: { backgroundColor: "#17171d" }
            }} />
        </Stack >
    );
}