import { Dimensions, Switch, StyleSheet, ScrollView, View, Text, TextInput, Image, Pressable } from "react-native";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { useState, useRef } from "react";
import RadioBtn from "../components/radioBtn";
import { auth, db } from "../auth/firebase";
import { setDoc, doc } from "firebase/firestore";
import { useUserData } from "../contexts/userContext";
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from "expo-image-picker";
import ModalBox from "../components/modal";
import CarouselComponent from "../components/carousel";
import ActivityBox from "../components/activity";

const SELECTION_LIMIT = 5;

const { width, height } = Dimensions.get("window");

export default function NewPostScreen({ navigation }) {
    const [message, setMessage] = useState("");
    const [selectedView, setSelectedView] = useState("Everyone");
    const [comments_enabled, setComments] = useState(true);
    const [used_media, setUsedMedia] = useState(false)
    const [media, setMedia] = useState<string[]>([])
    const [rs, setRs] = useState<ImagePickerAsset[]>([]);

    const activityText = useRef("Posting...");
    const activitySubtext = useRef("Updating info");
    const [activityVisible, setActivityVisible] = useState(false);
    const activityProgress = useRef(0);

    const [modalText, setModalText] = useState("");
    const [modalSubtext, setmodalSubtext] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const modalFnRef = useRef<() => void>(() => { });

    const user = auth.currentUser;
    const { userData } = useUserData();

    const scrollRef = useRef<ScrollView>(null);

    const scrollToTop = () => {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
    };

    function alert(text: string, subtext: string, onClose?: () => void) {
        setModalVisible(true);
        setModalText(text);
        setmodalSubtext(subtext);

        modalFnRef.current = onClose || (() => { });
    }
    function updateActivity(progress: number, activityInfo: string) {
        activityProgress.current = progress;
        activitySubtext.current = activityInfo;
    }

    function gen_post_title(email: string) {
        const userName = email.split("@")[0];
        const dateTime = new Date();
        const hr = dateTime.getHours();
        const mn = dateTime.getMinutes();
        const sec = dateTime.getSeconds();
        const day = dateTime.getDate();
        const month = dateTime.getMonth();
        const year = dateTime.getFullYear();

        return `${userName}-${day}-${month}-${year}_${hr}_${mn}_${sec}`;

    }

    function extractUrl(res: string) {
        const match = res.match(/https?:\/\/\S+/);
        if (match) {
            return match[0];
        } else {
            return "";
        }
    }
    async function uploadToHc(urls: string[]) {
        const hc = "https://cdn.hackclub.com/api/v3/new";
        console.log("This is the data hc upload fn got:", urls);

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
            console.log('response from hc: ', response);
            const deployedUrls = [];
            for (let i = 0; i < response.files.length; ++i) {
                deployedUrls.push(response.files[i].deployedUrl)
            }
            console.log(deployedUrls);
            setMedia(deployedUrls);
            return deployedUrls;
        } else {
            alert("Error", "Couldn't upload media, Please try again...");
            return [];
        }
    }

    const uploadFileTemp = async (file: any): Promise<string> => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', `https://bashupload.com/${file.fileName}`);

            xhr.onload = async () => {
                try {
                    resolve(extractUrl(xhr.responseText))
                } catch (err) {
                    reject(err);
                }
            };

            xhr.onerror = () => {
                reject(new Error("upload failed"));
            };

            xhr.setRequestHeader('Content-Type', 'application/octet-stream');
            xhr.send({ uri: file.uri, type: 'application/octet-stream', name: file.fileName });


        })
    }

    const uploadMedia = async (rs: any[]) => {
        try {
            // console.log("Value of rs : ", rs)
            let tempUrls: string[] = [];
            for (let i = 0; i < rs.length; ++i) {
                const url = await uploadFileTemp(rs[i]);
                tempUrls.push(url);
                // console.log("Pushed : ", url)
            }
            const deployedUrls = await uploadToHc(tempUrls);
            return deployedUrls;

        } catch (e) {
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
                        setDoc(doc(db, "posts", gen_post_title(user.email)), {
                            uid: user.uid,
                            likes: 0,
                            timestamp: new Date(),
                            media: PassedMedia,
                            post_message: message,
                            public: (selectedView == "Everyone") ? true : false,
                            users_liked: [],
                            used_media: true,
                            comments_enabled: comments_enabled,
                            comments: [],
                        }).then(() => {
                            updateActivity(1, "Done!");
                            setActivityVisible(false);
                            alert("Success", "Your log has been posted successfully!")
                        }).catch((e) => { alert("Error", `${e.code} ${e.message}. An error occured while posting :( `) })
                    }
                )
            } else {
                updateActivity(0.6, "Uploading info");
                setDoc(doc(db, "posts", gen_post_title(user.email)), {
                    uid: user.uid,
                    likes: 0,
                    timestamp: new Date(),
                    media: [],
                    post_message: message,
                    public: (selectedView == "Everyone") ? true : false,
                    users_liked: [],
                    used_media: false,
                    comments_enabled: comments_enabled,
                }).then(() => {
                    updateActivity(1, "Done!");
                    setActivityVisible(false);
                    alert("Success", "Your log has been posted successfully!")
                }).catch((e) => { alert("Error", `${e.code} ${e.message}. An error occured while posting :( `) })
            }
        }
    }


    return (
        <ScrollView style={{ backgroundColor: "#17171d", flex: 1, paddingTop: 50, marginBottom: 100 }} contentContainerStyle={{ alignItems: "center" }} ref={scrollRef}>

            <ModalBox
                onClose={() => modalFnRef.current()}
                animation="fade"
                isVisible={modalVisible}
                setIsVisible={setModalVisible}
                text={modalText}
                subtext={modalSubtext}
            />
            <ActivityBox
                progress={activityProgress.current}
                animation="fade"
                isVisible={activityVisible}
                setIsVisible={setActivityVisible}
                subtext={activitySubtext.current}
                text={activityText.current}
            />
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%" }}>
                <Image source={userData?.avatar ? { uri: userData.avatar } : require("../../assets/images/pfp.jpg")} style={{ marginHorizontal: 10, borderRadius: 50, width: 30, height: 30 }} />
                <Text style={{ color: "white", fontSize: 20, textAlign: "center", fontWeight: "bold", marginLeft: 10, marginVertical: 10 }}>Create New Log</Text>
                <MaterialDesignIcons name={"plus-box"} size={20} color={"white"} style={{ marginLeft: 10 }} />
            </View>
            <TextInput value={message} onChangeText={setMessage} textAlignVertical="top" multiline={true} style={styles.fieldContainer} placeholder="Have something to share?" placeholderTextColor={"#8492a6"} />

            {/* Media */}

            <View style={{ flexDirection: "row", alignItems: "flex-start", width: "100%", paddingLeft: 40, marginBottom: 20 }}>
                <Pressable style={{ padding: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: "#25252fff", borderRadius: 3 }} onPress={pickMedia}>
                    <MaterialDesignIcons name="file-image" color="#5f6878" size={25} />
                </Pressable>
                <Pressable style={{ padding: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: "#25252fff", borderRadius: 3 }}>
                    <MaterialDesignIcons name="file-gif-box" color="#5f6878" size={25} />
                </Pressable>
            </View>

            {/* Media Preview */}
            {
                used_media ?
                    <View style={{ height: "auto", width: width }}>
                        <Text style={[styles.heading, { marginLeft: 25 }]}>Attachments</Text>
                        <CarouselComponent
                            data={rs}
                        />

                        <View style={{ height: "auto", width: width, alignItems: "center", justifyContent: "center", paddingVertical: 20 }}>
                            <Pressable style={styles.button} onPressIn={() => { setMedia([]); setUsedMedia(false); }}>
                                <Text style={styles.btnTxt}>Remove Attachment</Text>
                                <MaterialDesignIcons name="close" color="white" size={20} />
                            </Pressable>
                        </View>

                    </View> :
                    <View>

                    </View>
            }

            {/* Other Options */}
            <View style={{ height: 0.3 * height, width: width, paddingTop: 20 }}>
                <Text style={styles.label}>Who Can View This?</Text>
                <RadioBtn
                    options={["Everyone", "Friends Only"]}
                    iconList={["earth", "account-group"]}
                    selected={selectedView}
                    setSelected={setSelectedView}
                    style={{ paddingLeft: 30, marginVertical: 15 }}
                />

                <Text style={styles.label}>Comments</Text>
                <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", paddingLeft: 40 }}>
                    <Switch
                        trackColor={{ false: '#8492a6', true: '#ec3750' }}
                        thumbColor={'#f4f3f4'}
                        onValueChange={() => { setComments(!comments_enabled); }}
                        value={comments_enabled}
                    />
                    <Text style={styles.subtxt}>{(comments_enabled ? "No one can comment on your post" : "Others can comment on your post")}</Text>
                </View>
            </View>

            <View style={{ height: "auto", width: width, alignItems: "center", justifyContent: "center", marginBottom: 100 }}>
                <Pressable style={styles.button} onPressIn={newLog}>
                    <Text style={styles.btnTxt}>Log</Text>
                    <MaterialDesignIcons name="note-text" color="white" size={20} />
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    fieldContainer: {
        backgroundColor: "#292932ff",
        borderRadius: 12,
        marginVertical: 10,
        width: "90%",
        height: 0.3 * height,
        paddingHorizontal: 12,
        color: "white",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        borderColor: "#444456ff",
        borderWidth: StyleSheet.hairlineWidth,
        fontSize: 18
    },
    label: {
        fontSize: 18,
        color: "white",
        width: "100%",
        textAlign: "left",
        paddingLeft: 40,
        fontWeight: "bold",
    },
    subtxt: {
        color: "#8492a6",
        fontSize: 15,
        marginLeft: 5
    },
    btnTxt: {
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
        width: "auto",
        textAlign: "center",
        marginHorizontal: 5
    },
    button: {
        height: "auto",
        width: "auto",
        borderRadius: 15,
        paddingVertical: 8,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ec3750"
    },
    heading: {
        color: "white",
        textAlign: "left",
        paddingLeft: 10,
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20
    },

});