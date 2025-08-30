import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Home() {
    const r = useRouter();
    return (
        <View>
            <Text> Sign up</Text>
            <Pressable onPressIn={() => { r.back() }}>
                <Text>
                    login
                </Text>
            </Pressable>
        </View>
    );
}