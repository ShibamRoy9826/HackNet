import CustomText from "@components/display/customText";
import { useTheme } from "@contexts/themeContext";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import CustomPressable from "./customPressable";

type Props = {
    func: () => void;
    style?: StyleProp<ViewStyle>;
    icon: "pencil-box-multiple" | "slack" | "note-text" | "close" | "plus-box" | "arrow-left";
    text: string;
    disabled?: boolean;
}
export default function IconButton({ text, func, style, icon, disabled }: Props) {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        buttonDisabled: {
            backgroundColor: colors.muted,
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
            backgroundColor: colors.primary,
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
    if (disabled) {
        return (
            <CustomPressable style={[style, styles.buttonDisabled]} onPress={func}>
                <CustomText style={{ color: colors.text, fontWeight: "bold", marginRight: 10 }}>{text}</CustomText>
                <MaterialDesignIcons name={icon} size={20} color={colors.text} />
            </CustomPressable>
        )
    }
    return (
        <CustomPressable style={[style, styles.button]} onPress={func}>
            <CustomText style={{ color: colors.text, fontWeight: "bold", marginRight: 10 }}>{text}</CustomText>
            <MaterialDesignIcons name={icon} size={20} color={colors.text} />
        </CustomPressable>
    )

}
