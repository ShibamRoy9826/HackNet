//components
import CustomButton from "@components/inputs/customButton";
import OnlyIconButton from "@components/inputs/onlyIconButton";
import { ScrollView, StyleSheet, Switch, View } from "react-native";

//others
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//firebase
import { auth } from '@auth/firebase';
import { signOut } from "firebase/auth";

//storage
import AsyncStorage from "@react-native-async-storage/async-storage";

//navigation
import CustomText from "@components/display/customText";
import { useRouter } from "expo-router";


export default function SettingsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [likeSoundEnabled, setLikeSoundEnabled] = useState(false);
    const [dislikeSoundEnabled, setDislikeSoundEnabled] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem("likeSound").then(
            (value) => {
                setLikeSoundEnabled(value === "true")
            }
        )

        AsyncStorage.getItem("dislikeSound").then(
            (value) => {
                setDislikeSoundEnabled(value === "true")
            }
        )
    }, [])

    useEffect(() => {
        if (likeSoundEnabled) {
            AsyncStorage.setItem("likeSound", "true");
        } else {
            AsyncStorage.setItem("likeSound", "false");
        }

        if (dislikeSoundEnabled) {
            AsyncStorage.setItem("dislikeSound", "true");
        } else {
            AsyncStorage.setItem("dislikeSound", "false");
        }

    }, [likeSoundEnabled, dislikeSoundEnabled])


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
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%", marginBottom: 20 }}>
                <OnlyIconButton icon="arrow-left" func={() => { router.back() }} style={{ top: 0, left: 20, zIndex: 5 }} />
                <CustomText style={{ color: "white", left: 50, fontSize: 18, top: 0, fontWeight: 700 }}>Settings</CustomText>
            </View>
            <ScrollView style={styles.listContainer} contentContainerStyle={{ alignContent: "center", alignItems: "center" }}>

                {/* Audio section */}
                <CustomText style={styles.heading}>Audio</CustomText>
                <View style={styles.section}>

                    <View style={styles.field}>

                        <CustomText style={styles.text}>Play sound on like</CustomText>

                        <Switch
                            trackColor={{ false: '#8492a6', true: '#ec3750' }}
                            thumbColor={'#f4f3f4'}
                            onValueChange={() => { setLikeSoundEnabled(!likeSoundEnabled); }}
                            value={likeSoundEnabled}
                        />
                    </View>

                    <View style={styles.field}>

                        <CustomText style={styles.text}>Play sound on dislike</CustomText>

                        <Switch
                            trackColor={{ false: '#8492a6', true: '#ec3750' }}
                            thumbColor={'#f4f3f4'}
                            onValueChange={() => { setDislikeSoundEnabled(!dislikeSoundEnabled); }}
                            value={dislikeSoundEnabled}
                        />
                    </View>
                </View>

                {/* App info section */}
                <CustomText style={styles.heading}>App Info</CustomText>
                <View style={styles.section}>
                    <View style={styles.field}>
                        <CustomText style={styles.text}>App Name</CustomText>
                        <CustomText style={styles.textValue}>{Constants.expoConfig?.name}</CustomText>
                    </View>

                    <View style={styles.field}>
                        <CustomText style={styles.text}>App Version</CustomText>
                        <CustomText style={styles.textValue}>{Constants.expoConfig?.version}</CustomText>
                    </View>

                    <View style={styles.field}>
                        <CustomText style={styles.text}>SDK Version</CustomText>
                        <CustomText style={styles.textValue}>{Constants.expoConfig?.sdkVersion}</CustomText>
                    </View>


                </View>



                <CustomButton
                    text="Log Out"
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
    },
    text: {
        color: "white",
        fontSize: 15,
    },
    textValue: {
        color: "#8492a6",
        fontSize: 15,
    },
    heading: {
        color: "#8492a6",
        fontSize: 20,
        fontWeight: 700,
        marginVertical: 10,
    },
    field: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginVertical: 10
    },
    section: {
        padding: 20,
        backgroundColor: "#25252f",
        borderWidth: 1,
        borderColor: "#17171d",
        width: "100%"
    }
});