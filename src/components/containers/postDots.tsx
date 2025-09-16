import ThreeDots from "@components/display/threeDots";
import { useBottomSheetContext } from "@contexts/BottomSheetContext";
import { report } from "@utils/otherUtils";
import { deletePost, dislikePost, likePost, sharePost } from "@utils/postUtils";
import { checkFollow, followUser, unfollowUser } from "@utils/userUtils";
import { useEffect, useState } from "react";
import { Alert, ToastAndroid } from "react-native";
import ShareBtns from "./shareBtns";

interface Props {
    postId: string,
    OpId: string,
    currentUserId: string
    liked: boolean,
    setLiked: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function PostThreeDots({ liked, postId, OpId, currentUserId }: Props) {

    const { closeSheet } = useBottomSheetContext();
    const [follow, setFollows] = useState(false);

    async function updateFollow() {
        const f = await checkFollow(OpId);
        setFollows(f);
    }

    useEffect(() => {
        updateFollow()
    }, [])

    return (
        <ThreeDots
            sheetHeader={
                <ShareBtns postId={postId} />
            }
            data={
                [
                    (OpId === currentUserId) ?
                        { text: "Delete Post", func: () => { deletePost(postId); closeSheet(); ToastAndroid.show("Successfully deleted post, reopen the app to see changes", 3) }, icon: "delete" } :
                        liked ?
                            { text: "Dislike Post", func: () => { likePost(postId, currentUserId) }, icon: "heart-outline" } :
                            { text: "Like Post", func: () => { dislikePost(postId, currentUserId) }, icon: "heart" }
                    ,
                    (follow) ?
                        { text: "Unfollow User", func: () => { unfollowUser(OpId); closeSheet(); }, icon: "account-minus" } :
                        { text: "Follow User", func: () => { followUser(OpId); closeSheet(); }, icon: "account-plus" }
                    ,

                    { text: "Share Post", func: () => { sharePost(postId) }, icon: "share-variant" },

                    {
                        text: "Report post", func: () => {
                            Alert.alert("Are you sure?", "Please don't make false reports, be sure before doing a report",
                                [
                                    {
                                        text: "Yes",
                                        onPress: () => {
                                            report("post", postId, currentUserId, OpId)
                                        }
                                    },
                                    {
                                        text: "No",
                                        style: "cancel"
                                    }
                                ]
                            )

                        }
                        , icon: "exclamation"
                    },

                ]}
        />
    )

}