import { useTheme } from "@contexts/themeContext";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import CustomPressable from "./customPressable";

type Props = {
    func: () => void;
    style?: StyleProp<ViewStyle>;
    icon: "file-image";
    iconColor?: string;

}
export default function SquareButton({ icon, func, style, iconColor }: Props) {

    const { colors } = useTheme();
    const styles = StyleSheet.create({
        button: {
            padding: 8,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border,
            borderRadius: 3
        },
    })
    return (
        <CustomPressable style={[style, styles.button]} onPress={func}>
            <MaterialDesignIcons name={icon} size={20} color={iconColor ? iconColor : "#5f6878"} />
        </CustomPressable>
    )

}
