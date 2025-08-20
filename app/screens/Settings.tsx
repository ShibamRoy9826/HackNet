import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import CustomText from "../components/customText";
import { signOut } from "firebase/auth";
import { auth } from '../auth/firebase'
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function SettingsScreen({ navigation }) {
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
                <Pressable onPress={logout} style={styles.button}>
                    <CustomText>Sign Out</CustomText>
                </Pressable>
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
    },
    button: {
        backgroundColor: "#ec3750",
        elevation: 10,
        marginVertical: 15,
        display: "flex",
        flexDirection: "row",
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        width: "30%",
    },

});