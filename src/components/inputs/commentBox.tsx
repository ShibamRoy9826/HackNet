import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { addComment } from "@utils/otherUtils";
import { useState } from "react";
import { Pressable, View } from "react-native";
import InputBox from "./inptField";

interface Prop {
    userId: string;
    postId: string;
}

export default function CommentBox({ userId, postId }: Prop) {
    const [comment, setComment] = useState("");

    return (
        <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
            <InputBox secure={false} value={comment} valueFn={setComment} color="#8492a6" icon="comment" type="none" placeholder="Comment here" />
            <Pressable style={{ padding: 8 }} onPress={() => { addComment(comment, postId); setComment("") }}>
                <MaterialDesignIcons name="send" color="#5f6878" size={25} />
            </Pressable>
        </View>
    );

}