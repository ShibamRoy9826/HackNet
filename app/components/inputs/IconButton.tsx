import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native"
import CustomText from "../display/customText"
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons"

type Props = {
    func: () => void;
    style?: StyleProp<ViewStyle>;
    icon: "pencil-box-multiple" | "slack" | "note-text" | "close" | "plus-box";
    text: string;
    disabled?: boolean;
}
export default function IconButton({ text, func, style, icon, disabled }: Props) {
    if (disabled) {
        return (
            <Pressable style={[style, styles.buttonDisabled]} onPress={func}>
                <CustomText style={{ color: "white", fontWeight: "bold", marginRight: 10 }}>{text}</CustomText>
                <MaterialDesignIcons name={icon} size={20} color={"white"} />
            </Pressable>
        )
    }
    return (
        <Pressable style={[style, styles.button]} onPress={func}>
            <CustomText style={{ color: "white", fontWeight: "bold", marginRight: 10 }}>{text}</CustomText>
            <MaterialDesignIcons name={icon} size={20} color={"white"} />
        </Pressable>
    )

}

const styles = StyleSheet.create({
    buttonDisabled: {
        backgroundColor: "#8492a6",
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