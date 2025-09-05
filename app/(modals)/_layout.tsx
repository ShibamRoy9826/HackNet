import { Stack } from "expo-router";

export default function ModalLayout() {
    return (
        <Stack screenOptions={{ presentation: "modal", headerShown: false, contentStyle: { backgroundColor: "#17171d" } }} />
    )
}