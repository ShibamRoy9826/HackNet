import { Pressable, Image, View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { Button } from "@react-navigation/elements";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from "react";
import { doc, updateDoc } from "firebase/firestore";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../auth/firebase';
import ModalBox from "../components/modal";
import { useUserData } from "../contexts/userContext";

export default function EditProfileScreen({ navigation }) {
    const currUser = auth.currentUser;
    const { userData } = useUserData();

    const [modalText, setModalText] = useState("");
    const [modalSubtext, setmodalSubtext] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const modalFnRef = useRef<() => void>(() => { });

    const insets = useSafeAreaInsets();
    const [imgData, setImgData] = useState<ImagePicker.ImagePickerAsset | null>(null);

    const [username, setUserName] = useState("");
    const [avatar, setAvatar] = useState(userData?.avatar || "");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");


    function alert(text: string, subtext: string, onClose?: () => void) {
        setModalVisible(true);
        setModalText(text);
        setmodalSubtext(subtext);

        modalFnRef.current = onClose || (() => { });
    }
    const updateProfileTxt = async (providedAvatar?: string) => {
        if (currUser) {
            const userRef = doc(db, "users", currUser.uid);
            await updateDoc(userRef, {
                uid: currUser.uid,
                email: currUser.email,
                displayName: username,
                createdAt: new Date(),
                avatar: providedAvatar ? providedAvatar : avatar,
                num_trackers: 0,
                num_tracking: 0,
                num_logs: 0,
                posts: [],
                liked_posts: [],
                friends: [],
                notifications: [],
                bio: bio
            }).then(() => { alert('Updated Successfully', "Your details were updated, if you don't see them, try reopening the app", () => { navigation.goBack() }) }).catch((e) => { alert("An error occured", e.message) })
        }
    }
    const updateProfile = async (providedAvatar?: string) => {
        if (currUser) {
            const userRef = doc(db, "users", currUser.uid);

            if (imgData) {
                console.log("Inside the first conditional,  avatar =", avatar);
                console.log("Oh and imgData=", imgData);
                await uploadImg(imgData);
            } else {
                await updateDoc(userRef, {
                    uid: currUser.uid,
                    email: currUser.email,
                    displayName: username,
                    createdAt: new Date(),
                    avatar: providedAvatar ? providedAvatar : avatar,
                    num_trackers: 0,
                    num_tracking: 0,
                    num_logs: 0,
                    posts: [],
                    liked_posts: [],
                    friends: [],
                    notifications: [],
                    bio: bio
                }).then(() => {
                    alert('Updated Successfully', "Your details were updated, if you don't see them, try reopening the app", () => { navigation.goBack() })
                }).catch((e) => {
                    alert("An error occured", e.message)
                })
            }

        }
    }

    function extractUrl(res: string) {
        const match = res.match(/https?:\/\/\S+/);
        if (match) {
            return match[0];
        } else {
            return "";
        }
    }
    // https://i.pinimg.com/736x/15/0f/a8/150fa8800b0a0d5633abc1d1c4db3d87.jpg  <- dummy pfp
    async function uploadToHc(urls: string[]) {
        const hc = "https://cdn.hackclub.com/api/v3/new";
        console.log("This is the data I got:", urls);

        const hcRes = await fetch(hc,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.EXPO_PUBLIC_HACKCLUB_CDN_KEY}`
                },
                body: JSON.stringify(urls)
            });

        const response = await hcRes.json();

        if (response) {
            setAvatar(response.files[0].deployedUrl);
            // console.log("The current value of avatar is ", avatar);
            // console.log("The current value of deployedUrl is ", response.files[0].deployedUrl);
            await updateProfileTxt(response.files[0].deployedUrl);
            // console.log("Updated text stuff too!");
        } else {
            alert("Error", "Couldn't upload avatar, Please try again...");
        }
    }

    const uploadImg = async (rs: any) => {
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', `https://bashupload.com/${rs.fileName}`);

            xhr.onload = async () => {
                // console.log(`Upload complete: ${xhr.responseText}`);
                await uploadToHc([extractUrl(xhr.responseText)]);
            };

            xhr.onerror = () => {
                // console.log('Upload failed.');
            };

            xhr.setRequestHeader('Content-Type', 'application/octet-stream');
            xhr.send({ uri: rs.uri, type: 'application/octet-stream', name: rs.fileName });

        } catch (e) {
            // console.log("Failed to upload file", e);
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

        console.log(result);

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

            <ModalBox
                onClose={() => modalFnRef.current()}
                animation="slide"
                isVisible={modalVisible}
                setIsVisible={setModalVisible}
                text={modalText}
                subtext={modalSubtext}
            />

            <View style={styles.fieldContainer}>
                <Image source={(imgData) ? { uri: imgData.uri } : { uri: avatar }} style={{ borderRadius: 50, width: 60, height: 60, marginHorizontal: 10 }} />

                <View style={{ alignItems: "center", justifyContent: "center", width: "100%" }}>
                    <Pressable style={[styles.button, { flexDirection: "row", marginRight: 40, marginTop: 20 }]} onPress={pickImage}>
                        <Text style={{ color: "white", fontWeight: "bold", marginRight: 10 }}>Edit Avatar</Text>
                        <MaterialDesignIcons name="pencil-box-multiple" size={20} color={"white"} />
                    </Pressable>
                </View>

                <Text style={styles.label}>Email:</Text>
                <TextInput style={styles.inputBoxDisabled} value={email} onChangeText={setEmail} editable={false}></TextInput>

                <Text style={styles.label}>Display Name:</Text>
                <TextInput style={styles.inputBox} value={username} onChangeText={setUserName}></TextInput>

                <Text style={styles.label}>Bio:</Text>
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