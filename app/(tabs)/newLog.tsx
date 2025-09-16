//components
import CarouselComponent from "@components/display/carousel";
import CustomText from "@components/display/customText";
import IconButton from "@components/inputs/IconButton";
import RadioBtn from "@components/inputs/radioBtn";
import SquareButton from "@components/inputs/squareButton";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Dimensions, Image, ScrollView, StyleSheet, Switch, TextInput, View } from "react-native";

//react and expo
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from "expo-image-picker";
import { useState } from "react";

//firebase
import { auth, db } from "@auth/firebase";
import { collection, doc, increment, setDoc, updateDoc } from "firebase/firestore";

//contexts
import { useModalContext } from "@contexts/modalContext";
import { useUserData } from "@contexts/userContext";

//func
import { uploadFileTemp, uploadToHc } from "@utils/otherUtils";

import { useTheme } from "@contexts/themeContext";


const SELECTION_LIMIT = 5;

const { width, height } = Dimensions.get("window");

export default function NewPostScreen() {
    const [message, setMessage] = useState("");
    const [selectedView, setSelectedView] = useState("Everyone");
    const [comments_enabled, setComments] = useState(true);
    const [used_media, setUsedMedia] = useState(false)
    const [rs, setRs] = useState<ImagePickerAsset[]>([]);

    const user = auth.currentUser;
    const { userData } = useUserData();

    const { alert, updateActivity, setActivityVisible, setActivityText } = useModalContext();
    setActivityText("Posting");


    const uploadMedia = async (rs: any[]) => {
        try {
            let tempUrls: string[] = [];
            for (let i = 0; i < rs.length; ++i) {
                const url = await uploadFileTemp(rs[i]);
                tempUrls.push(url);
            }
            const deployedUrls = await uploadToHc(tempUrls);

            if (deployedUrls.length === 0) {
                throw new Error("Couldn't deploy to hackclub cdn");
            }

            // setMedia(deployedUrls);

            return deployedUrls;

        } catch (e) {
            alert("Error", "Couldn't upload media, Please try again...");
            console.log("Failed to upload file", e);
        }
    }

    const pickMedia = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: false,
            quality: 0.8,
            selectionLimit: SELECTION_LIMIT,
            allowsMultipleSelection: true
        }
        );


        if (!result.canceled) {
            setRs(result.assets)
            setUsedMedia(true);
        } else {
            setUsedMedia(false);
        }
    };

    async function newLog() {
        setActivityVisible(true);
        updateActivity(0.1, "Processing Data");
        if (user) {
            if (used_media) {
                updateActivity(0.3, "Uploading Media");
                uploadMedia(rs).then(
                    async (PassedMedia) => {
                        updateActivity(0.6, "Uploading info");
                        setDoc(doc(collection(db, "posts")), {
                            uid: user.uid,
                            likes: 0,
                            timestamp: new Date(),
                            media: PassedMedia,
                            post_message: message,
                            public: (selectedView === "Everyone") ? true : false,
                            users_liked: [],
                            used_media: true,
                            comments_enabled: comments_enabled,
                            num_comments: 0
                        }).then(async () => {
                            updateDoc(doc(db, "users", user.uid),
                                {
                                    num_logs: increment(1)
                                })
                            updateActivity(1, "Done!");
                            setActivityVisible(false);
                            alert("Success", "Your log has been posted successfully!")
                        }).catch((e) => { alert("Error", `${e.code} ${e.message}. An error occured while posting :( `) })
                    }
                )
            } else {
                updateActivity(0.6, "Uploading info");
                setDoc(doc(collection(db, "posts")), {
                    uid: user.uid,
                    likes: 0,
                    timestamp: new Date(),
                    media: [],
                    post_message: message,
                    public: (selectedView === "Everyone") ? true : false,
                    users_liked: [],
                    used_media: false,
                    comments_enabled: comments_enabled,
                    num_comments: 0
                }).then(() => {
                    updateDoc(doc(db, "users", user.uid),
                        {
                            num_logs: increment(1)
                        })
                    updateActivity(1, "Done!");
                    setActivityVisible(false);
                    alert("Success", "Your log has been posted successfully!")
                }).catch((e) => { alert("Error", `${e.code} ${e.message}. An error occured while posting :( `) })
            }
        }
    }

    const { colors } = useTheme();
    const styles = StyleSheet.create({
        fieldContainer: {
            backgroundColor: colors.secondaryBackground,
            borderRadius: 12,
            marginVertical: 10,
            width: "90%",
            height: 0.3 * height,
            paddingHorizontal: 12,
            color: colors.text,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            borderColor: colors.border,
            borderWidth: StyleSheet.hairlineWidth,
            fontSize: 18
        },
        label: {
            fontSize: 18,
            color: colors.text,
            width: "100%",
            textAlign: "left",
            paddingLeft: 40,
            fontWeight: "bold",
        },
        subtxt: {
            color: colors.muted,
            fontSize: 15,
            marginLeft: 5
        },
        heading: {
            color: colors.text,
            textAlign: "left",
            paddingLeft: 10,
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 20
        },

    });


    return (
        <ScrollView style={{ backgroundColor: colors.background, flex: 1, paddingTop: 50, marginBottom: 100 }} contentContainerStyle={{ alignItems: "center" }}>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%" }}>
                <Image source={userData?.avatar ? { uri: userData.avatar } : require("@assets/images/pfp.jpg")} style={{ marginHorizontal: 10, borderRadius: 50, width: 30, height: 30 }} />
                <CustomText style={{ color: colors.text, fontSize: 20, textAlign: "center", fontWeight: "bold", marginLeft: 10, marginVertical: 10 }}>Create New Log</CustomText>
                <MaterialDesignIcons name={"plus-box"} size={20} color={colors.text} style={{ marginLeft: 10 }} />
            </View>
            <TextInput value={message} onChangeText={setMessage} textAlignVertical="top" multiline={true} style={styles.fieldContainer} placeholder="Have something to share?" placeholderTextColor={colors.muted} maxLength={1000} />

            {/* Media */}

            <View style={{ flexDirection: "row", alignItems: "flex-start", width: "100%", paddingLeft: 40, marginBottom: 20 }}>
                <SquareButton
                    icon="file-image"
                    func={pickMedia}
                />
            </View>

            {/* Media Preview */}
            {
                used_media ?
                    <View style={{ height: "auto", width: width }}>
                        <CustomText style={[styles.heading, { marginLeft: 25 }]}>Attachments</CustomText>
                        <CarouselComponent
                            data={rs}
                        />

                        <View style={{ height: "auto", width: width, alignItems: "center", justifyContent: "center", paddingVertical: 20 }}>
                            <IconButton
                                icon="close"
                                func={() => { setUsedMedia(false); }}
                                text="Remove Attachment"
                            />
                        </View>

                    </View> :
                    <View />

            }

            {/* Other Options */}
            <View style={{ height: 0.3 * height, width: width, paddingTop: 20 }}>
                <CustomText style={styles.label}>Who Can View This?</CustomText>
                <RadioBtn
                    options={["Everyone", "Friends Only"]}
                    iconList={["earth", "account-group"]}
                    selected={selectedView}
                    setSelected={setSelectedView}
                    style={{ paddingLeft: 30, marginVertical: 15 }}
                />

                <CustomText style={styles.label}>Comments</CustomText>
                <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", paddingLeft: 40 }}>
                    <Switch
                        trackColor={{ false: colors.muted, true: colors.primary }}
                        thumbColor={colors.text}
                        onValueChange={() => { setComments(!comments_enabled); }}
                        value={comments_enabled}
                    />
                    <CustomText style={styles.subtxt}>{(comments_enabled ? "No one can comment on your post" : "Others can comment on your post")}</CustomText>
                </View>
            </View>

            <View style={{ height: "auto", width: width, alignItems: "center", justifyContent: "center", marginBottom: 100 }}>
                <IconButton
                    icon="note-text"
                    text="Log"
                    func={newLog}
                />
            </View>
        </ScrollView>
    );
}
