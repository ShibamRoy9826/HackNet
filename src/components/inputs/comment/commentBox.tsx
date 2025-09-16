import InputBox from "@components/inputs/inptField";
import { useTheme } from "@contexts/themeContext";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { addComment } from "@utils/commentUtils";
import { useState } from "react";
import { View } from "react-native";
import CustomPressable from "../customPressable";

interface Prop {
    postId: string;
}

export default function CommentBox({ postId }: Prop) {
    const { colors } = useTheme();
    const [comment, setComment] = useState("");

    return (
        <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
            <InputBox maxLen={500} secure={false} value={comment} valueFn={setComment} color={colors.disabled} icon="comment" type="none" placeholder="Comment here" />
            <CustomPressable style={{ padding: 8 }} onPress={() => { addComment(comment, postId); setComment("") }}>
                <MaterialDesignIcons name="send" color="#5f6878" size={25} />
            </CustomPressable>
        </View>
    );

}