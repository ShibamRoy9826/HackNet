//components
import CommentBox from "@components/inputs/commentBox";
import LikeButton from "@components/inputs/likeButton";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Image, Pressable, StyleSheet, View } from "react-native";
import CarouselComponent from "../display/carousel";
import CustomText from "../display/customText";
//firebase
import { getUserData } from "@auth/firebase";
import {
    Timestamp
} from "firebase/firestore";

//react and expo
import { ImagePickerAsset } from "expo-image-picker";
import { useRouter } from 'expo-router';
import { memo, useEffect, useState } from "react";

//func
// import { checkUserLiked, dislikePost, likePost } from "@utils/otherUtils";
import ThreeDots from "@components/display/threeDots";
import { deletePost } from "@utils/otherUtils";
import { extractTime } from "@utils/stringTimeUtils";


interface Prop {
    id: string,
    uid: string,
    timestamp: Timestamp,
    message: string,
    used_media: boolean,
    media: string[],
    user_uid: string,
    comment_count: number
}


const Post = memo(function Post({ id, user_uid, media, used_media, message, uid, timestamp, comment_count }: Prop) {
    const router = useRouter();
    const [commentCount, setCommentCount] = useState(comment_count);

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
                {/* <View>
                    <Pressable onPress={() => { }}>
                        <MaterialDesignIcons name="dots-vertical" size={25} color={"#8492a6"} />
                    </Pressable>
                </View> */}
                <ThreeDots
                    postId={id}
                    data={[
                        (uid == user_uid) ?
                            { text: "Delete Post", func: () => { deletePost(id) }, icon: "delete" } :
                            { text: "Like Post", func: () => { }, icon: "heart" }
                        ,
                        { text: "Share Post", func: () => { console.log("Tried to share post"); }, icon: "share-variant" },
                        { text: "Follow User", func: () => { console.log("Tried to share post"); }, icon: "account-plus" }
                    ]}
                />
                {/* <CustomBottomSheet
                    data={[{ text: "Delete Post", func: () => { deletePost(id) } }]}
                /> */}
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
                <LikeButton userId={user_uid} postId={id} />

                <Pressable style={{ padding: 8, flexDirection: "row" }} onPress={() => { router.push(`/comments/${id}`) }}>
                    <MaterialDesignIcons name="comment" color="#5f6878" size={25} />
                    <CustomText style={{ color: "#8492a6", marginLeft: 5 }}>{commentCount}</CustomText>
                </Pressable>

                <Pressable style={{ padding: 8 }}>
                    <MaterialDesignIcons name="share" color="#5f6878" size={25} />
                </Pressable>
            </View>
            <CommentBox userId={user_uid} postId={id} />
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
