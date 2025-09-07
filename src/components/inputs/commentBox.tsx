import { db } from "@auth/firebase";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { addComment } from "@utils/otherUtils";
import { post } from "@utils/types";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import InputBox from "./inptField";

interface Prop {
    userId: string;
    postId: string;
}

export default function CommentBox({ userId, postId }: Prop) {
    const [comment, setComment] = useState("");
    const [visible, setVisible] = useState(false);

    async function checkIfComments() {
        const post = await getDoc(doc(db, "posts", postId));
        const postData: post = post.data() as post;
        if (postData.comments_enabled) {
            setVisible(true);
        }
    }

    useEffect(() => {
        checkIfComments();
    }, [])

    if (visible) {
        return (
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
                <InputBox secure={false} value={comment} valueFn={setComment} color="#8492a6" icon="comment" type="none" placeholder="Comment here" />
                <Pressable style={{ padding: 8 }} onPress={() => { addComment(comment, postId); setComment("") }}>
                    <MaterialDesignIcons name="send" color="#5f6878" size={25} />
                </Pressable>
            </View>
        );
    }
    return null;

}