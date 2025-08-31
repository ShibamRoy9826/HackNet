import { Redirect } from "expo-router";
import { View } from "react-native";
export default function RootPage() {
    return (
        <View>
            <Redirect href={"/auth/login"} />
        </View>
    )
}