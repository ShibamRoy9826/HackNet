import CustomText from "@components/display/customText";
import { useTheme } from "@contexts/themeContext";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import CustomPressable from "./customPressable";

type Props = {
    func: () => void;
    style?: StyleProp<ViewStyle>;
    text: string;
    fontWeight?: "bold" | "normal";
}
export default function CustomButton({ text, func, style, fontWeight }: Props) {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
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
    return (
        <CustomPressable style={[style, styles.button]} onPress={func}>
            <CustomText style={{ color: colors.text, fontWeight: fontWeight ? fontWeight : "bold" }}>{text}</CustomText>
        </CustomPressable>
    )

}
