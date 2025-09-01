import CustomText from "@components/display/customText";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { checkUserLiked, dislikePost, likePost } from "@utils/otherUtils";
import { useEffect, useRef, useState } from "react";
import { Pressable } from 'react-native';

interface Prop {
    likeCount: number;
    userId: string;
    postId: string;
}
export default function LikeButton({ likeCount, userId, postId }: Prop) {
    const [liked, setLiked] = useState(false);
    const likeRef = useRef(likeCount);
    const likeCooldown = useRef(false);

    useEffect(() => {
        setDefaultLikedState();
    }, [])

    function handleLike() {
        setLiked(!liked);
        // because liked changes after next render, we gotta use opposite thingy
        if (liked) {
            if (!likeCooldown.current) {
                likeRef.current -= 1;
                likeCooldown.current = true;
                dislikePost(postId, userId).then(
                    () => {
                        likeCooldown.current = false
                    }
                ).catch((e) => { console.log("dislike failed!") });
            }
        } else {
            if (!likeCooldown.current) {
                likeRef.current += 1;
                likeCooldown.current = true;
                likePost(postId, userId).then(
                    () => {
                        likeCooldown.current = false
                    }
                ).catch((e) => { console.log("like failed!") });
            }
        }
    }

    async function setDefaultLikedState() {
        const userLiked = await checkUserLiked(postId, userId);
        setLiked(userLiked);
    }

    return (
        <Pressable style={{ padding: 8, flexDirection: "row" }} onPress={handleLike}>
            <MaterialDesignIcons name={liked ? "heart" : "heart-outline"} color={liked ? "#ec3750" : "#5f6878"} size={25} />
            <CustomText style={{ color: "#8492a6", marginLeft: 5 }}>{likeRef.current}</CustomText>
        </Pressable>
    )




}