// navigation
import { Stack } from "expo-router";

export default function ProfileLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: "fade", contentStyle: { backgroundColor: "#17171d" } }}>
            <Stack.Screen name="[user_id]" />
            <Stack.Screen name="edit" />
        </Stack >
    );
}
