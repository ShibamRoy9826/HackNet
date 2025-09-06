import ThreeDots from "@components/display/threeDots";
import { useBottomSheetContext } from "@contexts/BottomSheetContext";
import { deletePost, likePost, sharePost } from "@utils/otherUtils";
import { ToastAndroid } from "react-native";

interface Props {
    postId: string,
    OpId: string,
    currentUserId: string
}
export default function PostThreeDots({ postId, OpId, currentUserId }: Props) {

    const { setSheetData, setExtraData, closeSheet, expandSheet } = useBottomSheetContext();
    return (
        <ThreeDots
            postId={postId}
            data={[
                (OpId == currentUserId) ?
                    { text: "Delete Post", func: () => { deletePost(postId); closeSheet(); ToastAndroid.show("Successfully deleted post, reload to see changes", 3) }, icon: "delete" } :
                    { text: "Like Post", func: () => { likePost(postId, currentUserId) }, icon: "heart" }
                ,
                { text: "Share Post", func: () => { sharePost(postId) }, icon: "share-variant" },
                { text: "Follow User", func: () => { console.log("Tried to share post"); }, icon: "account-plus" }
            ]}
        />
    )
}