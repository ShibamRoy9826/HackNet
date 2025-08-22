import { Pressable, StyleProp, StyleSheet , ViewStyle } from "react-native"
import CustomText from "../display/customText"

type Props = {
    func: () => void;
    style?: StyleProp<ViewStyle>;
    text: string;
    fontWeight?: "bold" | "normal";
}
export default function CustomButton({ text, func, style, fontWeight }: Props) {
    return (
        <Pressable style={[style, styles.button]} onPress={func}>
            <CustomText style={{ color: "white", fontWeight: fontWeight ? fontWeight : "bold" }}>{text}</CustomText>
        </Pressable>
    )

}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#ec3750",
        elevation: 10,
        marginVertical: 5,
        display: "flex",
        flexDirection: "row",
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center"
    },
})