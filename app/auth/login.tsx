import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Home() {
    const r = useRouter();
    return (
        <View>
            <Text> Login page</Text>
            <Pressable onPressIn={() => { r.push("/auth/signup") }}>
                <Text>
                    Signup
                </Text>
            </Pressable>
        </View>
    );
}