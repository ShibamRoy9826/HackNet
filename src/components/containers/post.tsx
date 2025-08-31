//components
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Image, Pressable, StyleSheet, View } from "react-native";
import CarouselComponent from "../display/carousel";
import CustomText from "../display/customText";
import InputBox from "../inputs/inptField";

//firebase
import { db, getUserData } from "@auth/firebase";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    increment,
    serverTimestamp,
    setDoc,
    Timestamp,
    updateDoc
} from "firebase/firestore";

//react and expo
import { ImagePickerAsset } from "expo-image-picker";
import { useRouter } from 'expo-router';
import { memo, useEffect, useState } from "react";

//func
import { extractTime } from "@utils/stringTimeUtils";


interface Prop {
    id: string,
    uid: string,
    timestamp: Timestamp,
    message: string,
    used_media: boolean,
    media: string[],
    user_uid: string,
    like_count: number,
    comment_count: number
}


const Post = memo(function Post({ id, user_uid, media, used_media, message, uid, timestamp, like_count, comment_count }: Prop) {
    const router = useRouter();
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(like_count);
    const [commentCount, setCommentCount] = useState(comment_count);


    const [comment, setComment] = useState("");
    const [userPfp, setUserPfp] = useState("https://i.pinimg.com/736x/15/0f/a8/150fa8800b0a0d5633abc1d1c4db3d87.jpg");
    const [OPName, setOPName] = useState("Your Name");

    const mediaMod: ImagePickerAsset[] = media.map(uri => ({
        uri,
        width: 0,
        height: 0,
        type: 'image',
    }));

    useEffect(() => {
        getOP();
    }, [uid])

    useEffect(() => {
        checkIfUserLiked();
        console.log("rendering: ", id);
    }, [])


    async function checkIfUserLiked() {
        const likeRef = doc(db, "posts", id, "likes", user_uid);
        try {

            const likeSnap = await getDoc(likeRef);
            const liked = likeSnap.exists();
            setLiked(liked);
        }
        catch (e) {
            console.log(e, " there's an error...");
        }
    }

    async function addComment() {
        try {
            await addDoc(collection(db, "posts", id, "comments"), {
                uid: user_uid,
                message: comment,
                timestamp: serverTimestamp(),
                likes: 0
            })
            await updateDoc(doc(db, "posts", id),
                {
                    num_comments: increment(1)
                })
            setCommentCount(commentCount + 1);
        } catch (e) {
            console.log(e);
        }
    }

    async function likePost() {
        try {
            await setDoc(doc(db, "posts", id, "likes", user_uid),
                {
                    createdAt: new Date()
                }
            )
            await updateDoc(doc(db, "posts", id),
                {
                    likes: increment(1)
                }).then(() => {
                    setLikeCount(likeCount + 1);
                })

        } catch (e) {
            console.log(e);
        }
    }

    async function dislikePost() {
        try {
            await deleteDoc(doc(db, "posts", id, "likes", user_uid));
            updateDoc(doc(db, "posts", id),
                {
                    likes: increment(-1)
                }).then(() => {
                    setLikeCount(likeCount - 1);
                }
                )
        } catch (e) {
            console.log(e);
        }
    }

    async function getOP() {
        await getUserData("users", uid).then(
            (data) => {
                if (data) {
                    setUserPfp(data.avatar);
                    setOPName(data.displayName);
                }
            }
        );
    }

    function redirectToProfile() {
        router.push(`/(tabs)/profile/${uid}`);
    }

    return (
        <View style={styles.postBox}>
            {/* OP details */}
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%", paddingHorizontal: 10 }}>
                <Pressable style={{ margin: "auto" }} onPress={() => { redirectToProfile() }}>
                    <Image source={{ uri: userPfp }} style={{ borderRadius: 50, width: 45, height: 45, margin: "auto" }} />
                </Pressable>
                <View style={styles.detailsContainer}>
                    <Pressable onPress={() => { redirectToProfile() }}>
                        <CustomText style={styles.username}>{OPName}</CustomText>
                        <CustomText style={styles.timestamp}>{extractTime(timestamp)}</CustomText>
                    </Pressable>
                </View>
                <View>
                    <Pressable style={{ padding: 5, marginLeft: "auto" }}>
                        <MaterialDesignIcons name="dots-vertical" color="#5f6878" size={25} />
                    </Pressable>
                </View>
            </View>
            <View style={{ paddingVertical: 10, borderColor: "#25252fff", borderTopWidth: StyleSheet.hairlineWidth, height: "auto" }}>
                {/* Posted content */}
                <CustomText style={{ color: "white", height: "auto", fontSize: 16, paddingHorizontal: 20, paddingVertical: 20 }}>{message}</CustomText>
                {
                    used_media && (
                        <CarouselComponent
                            data={mediaMod}
                        />
                    )
                }
            </View>

            {/* Buttons */}
            <View style={{ flexDirection: "row", paddingHorizontal: 20, justifyContent: "flex-start", alignItems: "center", width: "auto" }}>
                <Pressable style={{ padding: 8, flexDirection: "row" }} onPress={() => { setLiked(!liked); liked ? dislikePost() : likePost() }}>
                    <MaterialDesignIcons name={liked ? "heart" : "heart-outline"} color={liked ? "#ec3750" : "#5f6878"} size={25} />
                    <CustomText style={{ color: "#8492a6", marginLeft: 5 }}>{likeCount}</CustomText>
                </Pressable>

                <Pressable style={{ padding: 8, flexDirection: "row" }} onPress={() => { router.push(`/comments/${id}`) }}>
                    <MaterialDesignIcons name="comment" color="#5f6878" size={25} />
                    <CustomText style={{ color: "#8492a6", marginLeft: 5 }}>{commentCount}</CustomText>
                </Pressable>

                <Pressable style={{ padding: 8 }}>
                    <MaterialDesignIcons name="share" color="#5f6878" size={25} />
                </Pressable>
            </View>

            {/* add a comment*/}
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
                <InputBox secure={false} value={comment} valueFn={setComment} color="#8492a6" icon="comment" type="none" placeholder="Comment here" />
                <Pressable style={{ padding: 8 }} onPress={addComment}>
                    <MaterialDesignIcons name="send" color="#5f6878" size={25} />
                </Pressable>
            </View>

        </View>
    );
})

const styles = StyleSheet.create({
    postBox: {
        display: "flex",
        width: "100%",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#25252fff",
        paddingVertical: 10,
        marginVertical: 10
    },
    username: {
        fontSize: 15,
        fontWeight: "bold",
        color: "white",
        textAlign: "left",
        width: "100%"
    },
    timestamp: {
        fontSize: 13,
        color: "#8492a6",
        textAlign: "left",
        width: "100%"
    },
    detailsContainer: {
        padding: 15,
        display: "flex",
        width: "80%",
        justifyContent: "center",
        alignItems: "flex-start"
    }
})


export default Post;
