// navigation
import { useTheme } from "@contexts/themeContext";
import { Stack } from "expo-router";

export default function HomeLayout() {
    const { colors } = useTheme();
    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
            <Stack.Screen name="index" options={{ contentStyle: { backgroundColor: colors.background } }} />
        </Stack >
    );
}