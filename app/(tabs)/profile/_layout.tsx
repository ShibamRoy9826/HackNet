// navigation
import { useTheme } from "@contexts/themeContext";
import { Stack } from "expo-router";

export default function ProfileLayout() {
    const { colors } = useTheme();
    return (
        <Stack screenOptions={{ headerShown: false, animation: "fade", contentStyle: { backgroundColor: colors.background } }}>
            <Stack.Screen name="[user_id]" />
            <Stack.Screen name="edit" />
        </Stack >
    );
}
