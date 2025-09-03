import CustomText from "@components/display/customText";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { checkUserLiked, dislikePost, getLikeCount, likePost } from "@utils/otherUtils";
import { useEffect, useRef, useState } from "react";
import { Pressable } from 'react-native';

interface Prop {
    userId: string;
    postId: string;
}
export default function LikeButton({ userId, postId }: Prop) {
    const [liked, setLiked] = useState(false);
    const likeRef = useRef(0);
    const likeCooldown = useRef(false);

    useEffect(() => {
        setDefaultLikedState();
    }, [])

    function handleLike() {
        // because liked changes after next render, we gotta use opposite thingy
        if (liked) {
            if (!likeCooldown.current) {
                likeRef.current -= 1;
                dislikePost(postId, userId).then(
                    (val) => {
                        likeRef.current = val;
                    }
                ).catch((e) => { console.log("dislike failed!") });
            }
        } else {
            if (!likeCooldown.current) {
                likeRef.current += 1;
                likePost(postId, userId).then(
                    (val) => {
                        likeRef.current = val;
                    }
                ).catch((e) => { console.log("like failed!") });
            }
        }

        setLiked(!liked);
    }

    async function setDefaultLikedState() {
        const userLiked = await checkUserLiked(postId, userId);
        likeRef.current = await getLikeCount(postId);
        setLiked(userLiked);
    }

    return (
        <Pressable style={{ padding: 8, flexDirection: "row" }} onPress={handleLike}>
            <MaterialDesignIcons name={liked ? "heart" : "heart-outline"} color={liked ? "#ec3750" : "#5f6878"} size={25} />
            <CustomText style={{ color: "#8492a6", marginLeft: 5 }}>{likeRef.current}</CustomText>
        </Pressable>
    )




}