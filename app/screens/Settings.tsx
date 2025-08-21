//components
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import CustomButton from "../components/inputs/customButton";

//firebase
import { signOut } from "firebase/auth";
import { auth } from '../auth/firebase'

//storage
import AsyncStorage from "@react-native-async-storage/async-storage";

//typecasting
import { AppStackParamList } from "../utils/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<AppStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
    function logout() {
        signOut(auth).then(async () => {
            await AsyncStorage.clear();
            navigation.navigate("Login");
        }).catch((e) => {
            console.log("ERROR::: ", e.code, e.message)
        })
    }
    return (
        <View style={{ backgroundColor: "#17171d", flex: 1, paddingTop: 10, paddingBottom: 30, alignItems: "center" }}>
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