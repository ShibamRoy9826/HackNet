//components
import CustomButton from "@components/inputs/customButton";
import OnlyIconButton from "@components/inputs/onlyIconButton";
import { ScrollView, StyleSheet, Switch, View } from "react-native";

//others
import { useTheme } from "@contexts/themeContext";
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
import RadioBtn from "@components/inputs/radioBtn";
import { useRouter } from "expo-router";


const themes = ["default", "light", "catppuccin"] as const;

type themeList = typeof themes[number];

export default function SettingsScreen() {
    const { colors, setTheme } = useTheme();
    const [currTheme, setCurrTheme] = useState<themeList>("default");
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [likeSoundEnabled, setLikeSoundEnabled] = useState(true);
    const [dislikeSoundEnabled, setDislikeSoundEnabled] = useState(true);
    const [messageSoundEnabled, setMessageSoundEnabled] = useState(true);

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

        AsyncStorage.getItem("messageSound").then(
            (value) => {
                setMessageSoundEnabled(value === "true")
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

        if (messageSoundEnabled) {
            AsyncStorage.setItem("messageSound", "true");
        } else {
            AsyncStorage.setItem("messageSound", "false");
        }

    }, [likeSoundEnabled, dislikeSoundEnabled, messageSoundEnabled])


    function logout() {
        auth.signOut();
        signOut(auth).then(async () => {
            await AsyncStorage.clear();
            router.navigate("/auth/login");
        }).catch((e) => {
            console.log("ERROR::: ", e.code, e.message)
        })
    }

    const styles = StyleSheet.create({
        listContainer: {
            width: '95%',
            marginVertical: 5,
            borderRadius: 12,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
        },
        text: {
            color: colors.text,
            fontSize: 15,
        },
        textValue: {
            color: colors.muted,
            fontSize: 15,
        },
        heading: {
            color: colors.muted,
            fontSize: 20,
            fontWeight: 700,
            marginVertical: 10,
        },
        field: {
            flexDirection: "row",
            justifyContent: "space-around",
            marginVertical: 10
        },
        fieldVertical: {
            marginVertical: 10,
        },
        section: {
            padding: 20,
            backgroundColor: colors.border,
            borderWidth: 1,
            borderColor: colors.background,
            width: "100%"
        }
    });

    useEffect(() => {
        AsyncStorage.getItem("theme").then((data) => {
            if (data) {
                setCurrTheme(data as themeList);
            } else { }
        })
    }, [])

    function setNewTheme(a: themeList) {
        setCurrTheme(a);
        setTheme(a);
        AsyncStorage.setItem("theme", a);
    }
    return (
        <View style={{ backgroundColor: colors.background, flex: 1, paddingTop: insets.top, paddingBottom: 100, alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%", marginBottom: 20 }}>
                <OnlyIconButton icon="arrow-left" func={() => { router.back() }} style={{ top: 0, left: 20, zIndex: 5 }} />
                <CustomText style={{ color: colors.text, left: 50, fontSize: 18, top: 0, fontWeight: 700 }}>Settings</CustomText>
            </View>
            <ScrollView style={styles.listContainer} contentContainerStyle={{ alignContent: "center", alignItems: "center" }}>
                {/* Appearance */}
                <CustomText style={styles.heading}>Appearance</CustomText>
                <View style={styles.section}>

                    <View style={styles.fieldVertical}>
                        <CustomText style={styles.text}>Theme</CustomText>
                        <RadioBtn
                            options={["default", "light", "catppuccin"]}
                            iconList={["circle", "circle", "circle"]}
                            selected={currTheme}
                            setSelected={(a) => { setNewTheme(a as themeList) }}
                        />
                    </View>
                </View>

                {/* Audio section */}
                <CustomText style={styles.heading}>Audio</CustomText>
                <View style={styles.section}>

                    <View style={styles.field}>

                        <CustomText style={styles.text}>Play sound on like</CustomText>

                        <Switch
                            trackColor={{ false: colors.muted, true: colors.primary }}
                            thumbColor={colors.text}
                            onValueChange={() => { setLikeSoundEnabled(!likeSoundEnabled); }}
                            value={likeSoundEnabled}
                        />
                    </View>

                    <View style={styles.field}>

                        <CustomText style={styles.text}>Play sound on dislike</CustomText>

                        <Switch
                            trackColor={{ false: colors.muted, true: colors.primary }}
                            thumbColor={colors.text}
                            onValueChange={() => { setDislikeSoundEnabled(!dislikeSoundEnabled); }}
                            value={dislikeSoundEnabled}
                        />
                    </View>


                    <View style={styles.field}>

                        <CustomText style={styles.text}>Play sound on message</CustomText>

                        <Switch
                            trackColor={{ false: colors.muted, true: colors.primary }}
                            thumbColor={colors.text}
                            onValueChange={() => { setMessageSoundEnabled(!messageSoundEnabled); }}
                            value={messageSoundEnabled}
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
                    style={{ marginTop: 40, marginBottom: 40 }}
                />

            </ScrollView>
        </View>
    );
}
