import { useTheme } from "@contexts/themeContext";
import { Stack } from "expo-router";

export default function ModalLayout() {

    const { colors } = useTheme();
    return (
        <Stack screenOptions={{ presentation: "modal", headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
    )
}