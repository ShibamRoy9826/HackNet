//components
import CommentBox from "@components/inputs/comment/commentBox";
import CustomPressable from "@components/inputs/customPressable";
import LikeButton from "@components/inputs/likeButton";
import { Image, StyleSheet, View } from "react-native";
import CarouselComponent from "../display/carousel";
import CustomText from "../display/customText";

//firebase
import { getUserData } from "@auth/firebase";
import {
    Timestamp
} from "firebase/firestore";

import { sharePost } from "@utils/postUtils";

//react and expo
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { extractTime } from "@utils/stringTimeUtils";
import { ImagePickerAsset } from "expo-image-picker";
import { useRouter } from 'expo-router';
import { memo, useEffect, useState } from "react";

//func
import { useTheme } from "@contexts/themeContext";
import PostThreeDots from "./postDots";


interface Prop {
    id: string,
    uid: string,
    timestamp: Timestamp,
    message: string,
    used_media: boolean,
    media: string[],
    user_uid: string,
    comment_count: number,
    comments_enabled: boolean
}


const Post = memo(function Post({ id, user_uid, media, used_media, message, uid, timestamp, comment_count, comments_enabled }: Prop) {
    const router = useRouter();
    const [commentCount, setCommentCount] = useState(comment_count);
    const [liked, setLiked] = useState(false);

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
        if (uid === user_uid) {
            router.push(`/(tabs)/profile/${uid}`);
        } else {
            router.push(`/(modals)/profile/${uid}`);
        }
    }

    const { colors } = useTheme();

    const styles = StyleSheet.create({
        postBox: {
            display: "flex",
            width: "100%",
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
            paddingVertical: 10,
            marginVertical: 10
        },
        username: {
            fontSize: 15,
            fontWeight: "bold",
            color: colors.text,
            textAlign: "left",
            width: "100%"
        },
        timestamp: {
            fontSize: 13,
            color: colors.smallText,
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


    return (
        <View style={styles.postBox}>
            {/* OP details */}
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%", paddingHorizontal: 10 }}>
                <CustomPressable style={{ margin: "auto" }} onPress={() => { redirectToProfile() }}>
                    <Image source={{ uri: userPfp }} style={{ borderRadius: 50, width: 45, height: 45, margin: "auto" }} />
                </CustomPressable>
                <View style={styles.detailsContainer}>
                    <CustomPressable onPress={() => { redirectToProfile() }}>
                        <CustomText style={styles.username}>{OPName}</CustomText>
                        <CustomText style={styles.timestamp}>{extractTime(timestamp)}</CustomText>
                    </CustomPressable>
                </View>
                <PostThreeDots
                    postId={id}
                    OpId={uid}
                    currentUserId={user_uid}
                    liked={liked}
                    setLiked={setLiked}
                />
            </View>
            <View style={{ paddingVertical: 10, borderColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth, height: "auto" }}>
                {/* Posted content */}
                <CustomText style={{ color: colors.text, height: "auto", fontSize: 16, paddingHorizontal: 20, paddingVertical: 20 }}>{message}</CustomText>
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
                <LikeButton userId={user_uid} postId={id} liked={liked} setLiked={setLiked} />

                <CustomPressable style={{ padding: 8, flexDirection: "row" }} onPress={() => { router.push(`/comments/${id}`) }}>
                    <MaterialDesignIcons name="comment" color={colors.disabled} size={25} />
                    <CustomText style={{ color: colors.muted, marginLeft: 5 }}>{commentCount}</CustomText>
                </CustomPressable>

                <CustomPressable style={{ padding: 8 }} onPress={() => { sharePost(id) }}>
                    <MaterialDesignIcons name="share" color={colors.disabled} size={25} />
                </CustomPressable>
            </View>
            {
                comments_enabled ?
                    <CommentBox postId={id} />
                    : null

            }
        </View>
    );
})


export default Post;
