// components
import CustomText from "@components/display/customText";
import CustomButton from "@components/inputs/customButton";
import IconButton from "@components/inputs/IconButton";
import ImageRadioBtn from "@components/inputs/imageRadioBtn";
import OnlyIconButton from "@components/inputs/onlyIconButton";
import { Image, ImageSourcePropType, KeyboardAvoidingView, ScrollView, StyleSheet, TextInput, View } from "react-native";

//contexts
import { useModalContext } from "@contexts/modalContext";
import { useTheme } from "@contexts/themeContext";
import { useUserData } from "@contexts/userContext";

//firebase
import { auth, db } from '@auth/firebase';
import { doc, updateDoc } from "firebase/firestore";

//others
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//func
import { uploadFileTemp, uploadToHc } from '@utils/otherUtils';
import { useRouter } from "expo-router";

const bannerList: ImageSourcePropType[] = [
    require('@assets/images/banners/banner01.png'),
    require('@assets/images/banners/banner02.png'),
    require('@assets/images/banners/banner03.png')
]


export default function EditProfileScreen() {
    const router = useRouter();

    const currUser = auth.currentUser;
    const { userData } = useUserData();

    // const [currBanner, setCurrBanner] = useState<ImageSourcePropType>();
    const { colors } = useTheme();

    const insets = useSafeAreaInsets();
    const [imgData, setImgData] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [bannerData, setBannerData] = useState<ImagePicker.ImagePickerAsset | ImageSourcePropType | null>(null);

    const [username, setUserName] = useState("");
    const [avatar, setAvatar] = useState(userData?.avatar || "");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");

    const { alert, updateActivity, setActivityVisible, setActivityText } = useModalContext();
    setActivityText("Updating");

    //////////| Functions Start |////////////////////
    const updateProfileInfo = async (providedAvatar?: string, providedBanner?: string) => {
        if (currUser) {
            const userRef = doc(db, "users", currUser.uid);
            updateActivity(0.6, "Processing Data");
            try {
                let data = {
                    uid: currUser.uid,
                    email: currUser.email,
                    displayName: username,
                    displayNameLower: username.toLowerCase(),
                    avatar: userData ? userData.avatar : "",
                    banner: userData ? userData.banner : "",
                    createdAt: userData ? userData.createdAt : new Date(),
                    num_tracking: userData ? userData.num_tracking : 0,
                    num_logs: userData ? userData.num_logs : 0,
                    bio: bio
                }

                if (providedAvatar) {
                    data.avatar = providedAvatar;
                }
                if (providedBanner) {
                    data.banner = providedBanner;
                }

                await updateDoc(userRef, data);
                updateActivity(0.9, "Updated Successfully!")
                setActivityVisible(false);
                alert('Updated Successfully', "Your details were updated, if you don't see them, try reopening the app", () => { router.back() })
            } catch {
                alert("An error occured", "Please try again!")
                updateActivity(0.6, "Something's wrong");
            }
        }
    }

    async function uploadImg(file: any) {
        try {
            const url = await uploadFileTemp(file);
            updateActivity(0.5, "Uploaded image to temporary server");
            const deployedUrl = await uploadToHc([url]);
            return deployedUrl[0];
        } catch (e) {
            console.log('an error occured: ', e);
            updateActivity(0.5, "Error!");
            setActivityVisible(false);
            alert("An error occured", "Please try again!")
            return "";
        }
    }


    // basically a wrapper function to update profile
    const updateProfile = async () => {
        setActivityVisible(true);
        updateActivity(0.1, "Processing data");

        if (imgData && bannerData) {
            updateActivity(0.3, "Uploading avatar image");
            const deployedAvatar = await uploadImg(imgData);
            setAvatar(deployedAvatar);
            updateActivity(0.5, "Uploaded avatar image");

            let deployedBanner;
            if (typeof bannerData !== "object") {
                deployedBanner = (bannerList.indexOf(bannerData) + 1).toString()
            } else {
                updateActivity(0.7, "Uploading banner image");
                deployedBanner = await uploadImg(bannerData);
                updateActivity(0.9, "Uploaded banner image");
            }
            await updateProfileInfo(deployedAvatar, deployedBanner);
        } else if (imgData) {
            updateActivity(0.3, "Uploading avatar image");
            const deployedAvatar = await uploadImg(imgData);
            setAvatar(deployedAvatar);
            updateActivity(0.5, "Uploaded avatar image");

            await updateProfileInfo(deployedAvatar);
        } else if (bannerData) {
            let deployedBanner;
            if (typeof bannerData !== "object") {
                deployedBanner = (bannerList.indexOf(bannerData) + 1).toString()
            } else {
                updateActivity(0.7, "Uploading banner image");
                deployedBanner = await uploadImg(bannerData);
                updateActivity(0.9, "Uploaded banner image");
            }
            await updateProfileInfo(userData ? userData.avatar : "", deployedBanner);
        }
        else {
            updateActivity(0.3, "Updating info");
            updateProfileInfo();
        }

    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const rs = result.assets[0];
            setImgData(rs);
        }
    };
    const pickBanner = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1588, 635],
            quality: 1,
        });

        if (!result.canceled) {
            const rs = result.assets[0];
            setBannerData(rs);
        }
    };

    function isImagePickerAsset(obj: any): obj is ImagePicker.ImagePickerAsset {
        return obj && typeof obj === "object" && typeof obj.uri === "string";
    }


    function handleBanner(path: string | ImageSourcePropType | ImagePicker.ImagePickerAsset | number, local?: boolean) {
        if (local && typeof path !== "string") {
            if (typeof path === "number") {
                return path;
            } else if (isImagePickerAsset(path)) {
                return { uri: path.uri };
            }
        } else if (typeof path === "string") {
            if (path.startsWith("http")) {
                return { uri: path }
            } else if (path === "1") {
                return bannerList[0]
            } else if (path === "2") {
                return bannerList[1]
            } else {
                return bannerList[2]
            }
        } else {
            return path
        }
    }

    //////////| Functions End |////////////////////
    useEffect(() => {
        if (userData) {
            setUserName(userData.displayName ?? '');
            setEmail(userData.email ?? '');
            setBio(userData.bio ?? '');
            setAvatar(userData.avatar ?? '');
        }
    }, [userData])
    const styles = StyleSheet.create({
        label: {
            color: "white",
            textAlign: "left",
            width: "100%",
            paddingHorizontal: 30
        },
        container: {
            backgroundColor: colors.background,
            flex: 1
        },
        fieldContainer: {
            display: "flex",
            alignItems: "center",
        },
        inputBox: {
            backgroundColor: colors.secondaryBackground,
            borderRadius: 12,
            margin: 10,
            width: "80%",
            paddingHorizontal: 12,
            color: colors.text,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            borderColor: colors.border,
            borderWidth: StyleSheet.hairlineWidth
        },
        inputBoxDisabled: {
            backgroundColor: colors.disabled,
            borderRadius: 12,
            margin: 10,
            width: "80%",
            paddingHorizontal: 12,
            color: colors.text,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            borderColor: colors.border,
            borderWidth: StyleSheet.hairlineWidth
        }
    })

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
            <ScrollView contentContainerStyle={styles.fieldContainer} style={[styles.container, { paddingTop: insets.top }]}>
                <View style={{ flexDirection: "row", alignItems: "center", width: "100%", marginBottom: 40 }}>
                    <OnlyIconButton icon="arrow-left" func={() => { router.back() }} style={{ top: 0, left: 20, zIndex: 5 }} />
                    <CustomText style={{ color: colors.text, left: 50, fontSize: 18, top: 0, fontWeight: 700 }}>Edit Profile</CustomText>
                </View>
                <CustomText style={styles.label}>Avatar:</CustomText>
                <Image source={(imgData) ? { uri: imgData.uri } : { uri: avatar }} style={{ borderRadius: 50, width: 60, height: 60, marginHorizontal: 10 }} />

                <View style={{ alignItems: "center", justifyContent: "center", width: "100%" }}>
                    <IconButton
                        func={pickImage}
                        style={{ flexDirection: "row", marginRight: 40, marginTop: 20 }}
                        text={"Edit Avatar"}
                        icon={"pencil-box-multiple"}
                    />
                </View>
                <CustomText style={styles.label}>Default Banners:</CustomText>
                <ImageRadioBtn images={bannerList} setImage={setBannerData} currImage={bannerData ? bannerData : bannerList[3]} />

                <CustomText style={styles.label}>Banner Preview:</CustomText>

                <Image source={(bannerData) ?
                    handleBanner(bannerData, true) :
                    userData
                        ? handleBanner(userData.banner) :
                        require("@assets/images/banners/banner03.png")}
                    style={{ marginVertical: 20, width: "100%", height: 100 }} />

                <View style={{ alignItems: "center", justifyContent: "center", width: "100%" }}>
                    <IconButton
                        func={pickBanner}
                        style={{ flexDirection: "row", marginRight: 40, marginTop: 20 }}
                        text={"Custom Banner"}
                        icon={"pencil-box-multiple"}
                    />
                </View>

                <CustomText style={styles.label}>Email:</CustomText>
                <TextInput style={styles.inputBoxDisabled} value={email} onChangeText={setEmail} editable={false}></TextInput>

                <CustomText style={styles.label}>Display Name:</CustomText>
                <TextInput style={styles.inputBox} value={username} onChangeText={setUserName}></TextInput>

                <CustomText style={styles.label}>Bio:</CustomText>
                <TextInput style={[styles.inputBox, { height: 200 }]} value={bio} onChangeText={setBio} textAlignVertical="top" multiline={true}></TextInput>
                <CustomButton
                    func={updateProfile}
                    text={"Save"}
                    style={{ marginBottom: 200 }}
                />

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

