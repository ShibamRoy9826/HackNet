// components
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Pressable, Image, View, TextInput, StyleSheet, ScrollView } from "react-native";
import CustomText from "../components/customText";
import { Button } from "@react-navigation/elements";

//contexts
import { useUserData } from "../contexts/userContext";
import { useModalContext } from "../contexts/modalContext";

//firebase
import { auth, db } from '../auth/firebase';
import { doc, updateDoc } from "firebase/firestore";

//others
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';

//func
import { uploadFileTemp, uploadToHc } from '../utils/otherUtils';

//types
import { AppStackParamList } from "../utils/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<AppStackParamList, 'EditProfile'>;

export default function EditProfileScreen({ navigation }: Props) {
    const currUser = auth.currentUser;
    const { userData } = useUserData();

    const insets = useSafeAreaInsets();
    const [imgData, setImgData] = useState<ImagePicker.ImagePickerAsset | null>(null);

    const [username, setUserName] = useState("");
    const [avatar, setAvatar] = useState(userData?.avatar || "");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");

    const { alert, updateActivity, setActivityVisible } = useModalContext();

    const updateProfileInfo = async (providedAvatar?: string) => {
        if (currUser) {
            const userRef = doc(db, "users", currUser.uid);
            updateActivity(0.6, "Processing Data");
            try {
                let data = {
                    uid: currUser.uid,
                    email: currUser.email,
                    displayName: username,
                    createdAt: userData ? userData.createdAt : new Date(),
                    num_trackers: userData ? userData.num_trackers : 0,
                    num_tracking: userData ? userData.num_tracking : 0,
                    num_logs: userData ? userData.num_logs : 0,
                    friends: userData ? userData.friends : [],
                    bio: bio
                }

                if (providedAvatar) {
                    data.avatar = providedAvatar;
                }

                await updateDoc(userRef, data);
                updateActivity(0.9, "Updated Successfully!")
                setActivityVisible(false);
                alert('Updated Successfully', "Your details were updated, if you don't see them, try reopening the app", () => { navigation.goBack() })
            } catch (e) {
                alert("An error occured", `${e}`)
                updateActivity(0.6, "Something's wrong");
            }
        }
        // updateActivity(0.6, "Something's wrong");
        // setActivityVisible(false);
    }

    async function uploadImg(file: any) {
        try {
            const url = await uploadFileTemp(file);
            const deployedUrl = await uploadToHc([url]);
            setAvatar(deployedUrl[0]);
            await updateProfileInfo(deployedUrl[0]);
        } catch (e) {
            console.log('an error occured: ', e);
        }
    }

    const updateProfile = async () => {
        setActivityVisible(true);
        updateActivity(0.1, "Processing data");

        if (currUser) {

            if (imgData) {
                updateActivity(0.3, "Uploading image");
                await uploadImg(imgData);
                updateActivity(0.5, "Uploaded image");
            } else {
                updateActivity(0.3, "Updating info");
                updateProfileInfo();
            }

        }
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        // console.log(result);

        if (!result.canceled) {
            const rs = result.assets[0];
            setImgData(rs);
        } else {
            // console.log("It got cancelled....");
        }
    };

    useEffect(() => {
        if (userData) {
            setUserName(userData.displayName ?? '');
            setEmail(userData.email ?? '');
            setBio(userData.bio ?? '');
            setAvatar(userData.avatar ?? '');
        }
    }, [userData])

    return (
        <ScrollView style={[styles.container, { paddingTop: insets.top }]}>

            <View style={styles.fieldContainer}>
                <Image source={(imgData) ? { uri: imgData.uri } : { uri: avatar }} style={{ borderRadius: 50, width: 60, height: 60, marginHorizontal: 10 }} />

                <View style={{ alignItems: "center", justifyContent: "center", width: "100%" }}>
                    <Pressable style={[styles.button, { flexDirection: "row", marginRight: 40, marginTop: 20 }]} onPress={pickImage}>
                        <CustomText style={{ color: "white", fontWeight: "bold", marginRight: 10 }}>Edit Avatar</CustomText>
                        <MaterialDesignIcons name="pencil-box-multiple" size={20} color={"white"} />
                    </Pressable>
                </View>

                <CustomText style={styles.label}>Email:</CustomText>
                <TextInput style={styles.inputBoxDisabled} value={email} onChangeText={setEmail} editable={false}></TextInput>

                <CustomText style={styles.label}>Display Name:</CustomText>
                <TextInput style={styles.inputBox} value={username} onChangeText={setUserName}></TextInput>

                <CustomText style={styles.label}>Bio:</CustomText>
                <TextInput style={[styles.inputBox, { height: "40%" }]} value={bio} onChangeText={setBio} textAlignVertical="top" multiline={true}></TextInput>

            </View>
            <View style={{ alignItems: "center", justifyContent: "center", width: "100%", marginTop: "10%" }}>
                <Button color="white" style={styles.button} onPressIn={updateProfile}>
                    Save
                </Button>
            </View>

        </ScrollView>
    );
}


const styles = StyleSheet.create({
    label: {
        color: "white",
        textAlign: "left",
        width: "100%",
        paddingHorizontal: 30
    },
    container: {
        backgroundColor: "#17171d",
        flex: 1
    },
    fieldContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%"
    },
    inputBox: {
        backgroundColor: "#292932ff",
        borderRadius: 12,
        margin: 10,
        width: "80%",
        paddingHorizontal: 12,
        color: "white",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        borderColor: "#444456ff",
        borderWidth: StyleSheet.hairlineWidth
    },
    inputBoxDisabled: {
        backgroundColor: "#3b3b47ff",
        borderRadius: 12,
        margin: 10,
        width: "80%",
        paddingHorizontal: 12,
        color: "white",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        borderColor: "#444456ff",
        borderWidth: StyleSheet.hairlineWidth
    },
    smallTxt: {
        fontSize: 15,
        marginVertical: 20,
        color: "#8492a6"
    },
    button: {
        backgroundColor: "#ec3750",
        elevation: 10,
        marginVertical: 5,
        display: "flex",
        flexDirection: "row",
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center"
    },
})