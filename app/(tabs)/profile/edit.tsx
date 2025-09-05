// components
import CustomText from "@components/display/customText";
import CustomButton from "@components/inputs/customButton";
import IconButton from "@components/inputs/IconButton";
import { Image, ImageSourcePropType, ScrollView, StyleSheet, TextInput, View } from "react-native";

//contexts
import { useModalContext } from "@contexts/modalContext";
import { useUserData } from "@contexts/userContext";

//firebase
import { auth, db } from '@auth/firebase';
import { doc, updateDoc } from "firebase/firestore";

//others
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//func
import ImageRadioBtn from "@components/inputs/imageRadioBtn";
import { uploadFileTemp, uploadToHc } from '@utils/otherUtils';
import { useRouter } from "expo-router";

const bannerList = [
    require('@assets/images/banners/banner01.png'),
    require('@assets/images/banners/banner02.png'),
    require('@assets/images/banners/banner03.png')
]



export default function EditProfileScreen() {
    const router = useRouter();

    const currUser = auth.currentUser;
    const { userData } = useUserData();

    const [currBanner, setCurrBanner] = useState<ImageSourcePropType>();

    const insets = useSafeAreaInsets();
    const [imgData, setImgData] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [bannerData, setBannerData] = useState<ImagePicker.ImagePickerAsset | null | string>(null);

    const [username, setUserName] = useState("");
    const [avatar, setAvatar] = useState(userData?.avatar || "");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");

    const { alert, updateActivity, setActivityVisible, setActivityText } = useModalContext();
    setActivityText("Updating");

    useEffect(() => {
        if (currBanner) {
            setBannerData(convertToNum(currBanner));
        } else {
            if (userData) {
                setBannerData(userData.banner)
            } else {
                setBannerData(bannerList[2]);
            }
        }
    }, [currBanner])



    //////////| Functions Start |////////////////////
    function convertToNum(path: ImageSourcePropType | undefined) {
        if (path == bannerList[0]) {
            return "1"
        } else if (path == bannerList[1]) {
            return "2"
        } else if (path == bannerList[2]) {
            return "3"
        } else {
            return "3"
        }
    }
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
            updateActivity(0.5, "Uploaded avatar image to temporary server");
            const deployedUrl = await uploadToHc([url]);
            setAvatar(deployedUrl[0]);
            await updateProfileInfo(deployedUrl[0]);
        } catch (e) {
            console.log('an error occured: ', e);
            updateActivity(0.5, "Error!");
            setActivityVisible(false);
            alert("An error occured", "Please try again!")
        }
    }

    // basically a wrapper function to update profile
    const updateProfile = async () => {
        setActivityVisible(true);
        updateActivity(0.1, "Processing data");

        if (imgData) {
            updateActivity(0.3, "Uploading avatar image");
            await uploadImg(imgData);  //updateProfileInfo is being called inside of uploadImg
            updateActivity(0.7, "Uploaded avatar image");
        } else if (bannerData && typeof bannerData == "string") {
            updateActivity(0.3, "Updating info");
            console.log("Worked!", bannerData);
            updateProfileInfo(userData ? userData.avatar : "", bannerData);
        } else {
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
    function handleBanner(path: string) {
        if (path.startsWith("http")) {
            return { uri: path }
        } else {
            if (path === "1") {
                const a = require("@assets/images/banners/banner01.png")
                setCurrBanner(a);
                setBannerData("1");
                return a;

            } else if (path === "2") {
                const a = require("@assets/images/banners/banner02.png")
                setCurrBanner(a);
                setBannerData("2");
                return a;
            } else if (path === "3") {
                const a = require("@assets/images/banners/banner03.png")
                setCurrBanner(a);
                setBannerData("3");
                return a;
            } else {
                const a = require("@assets/images/banners/banner03.png")
                setCurrBanner(a);
                return a;
            }
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

    return (
        <ScrollView contentContainerStyle={styles.fieldContainer} style={[styles.container, { paddingTop: insets.top }]}>
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
            <ImageRadioBtn images={bannerList} setImage={setCurrBanner} currImage={currBanner ? currBanner : require("@assets/images/banners/banner03.png")} />

            <CustomText style={styles.label}>Banner Preview:</CustomText>
            <Image source={(currBanner) ?
                currBanner :
                userData
                    ? handleBanner(userData.banner) :
                    require("@assets/images/banners/banner03.png")}
                style={{ marginVertical: 20, width: "100%", height: 100 }} />

            <View style={{ alignItems: "center", justifyContent: "center", width: "100%" }}>
                <IconButton
                    func={pickImage}
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
    }
})