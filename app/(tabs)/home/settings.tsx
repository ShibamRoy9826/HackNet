//components
import CustomButton from "@components/inputs/customButton";
import { ScrollView, StyleSheet, View } from "react-native";

//others
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//firebase
import { auth } from '@auth/firebase';
import { signOut } from "firebase/auth";

//storage
import AsyncStorage from "@react-native-async-storage/async-storage";

//navigation
import { useRouter } from "expo-router";


export default function SettingsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    function logout() {
        auth.signOut();
        signOut(auth).then(async () => {
            await AsyncStorage.clear();
            router.navigate("/auth/login");
        }).catch((e) => {
            console.log("ERROR::: ", e.code, e.message)
        })
    }
    return (
        <View style={{ backgroundColor: "#17171d", flex: 1, paddingTop: insets.top, paddingBottom: 100, alignItems: "center" }}>
            <ScrollView style={styles.listContainer} contentContainerStyle={{ alignContent: "center", alignItems: "center" }}>
                <CustomButton
                    text="Sign Out"
                    func={logout}
                    style={{ marginTop: 40 }}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        width: '95%',
        marginVertical: 5,
        borderRadius: 12,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#444456ff",
    }
});