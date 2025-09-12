// navigation
import { Stack } from "expo-router";

export default function HomeLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#17171d" } }}>
            <Stack.Screen name="index" options={{ contentStyle: { backgroundColor: "#17171d" } }} />
        </Stack >
    );
}