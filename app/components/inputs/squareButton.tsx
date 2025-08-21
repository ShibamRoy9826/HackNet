import { Pressable, StyleProp, StyleSheet } from "react-native"
import CustomText from "../display/customText"
import { ViewStyle } from "react-native"
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons"

type Props = {
    func: () => void;
    style?: StyleProp<ViewStyle>;
    icon: "file-image";
    iconColor?: string;

}
export default function SquareButton({ icon, func, style, iconColor }: Props) {
    return (
        <Pressable style={[style, styles.button]} onPress={func}>
            <MaterialDesignIcons name={icon} size={20} color={iconColor ? iconColor : "#5f6878"} />
        </Pressable>
    )

}

const styles = StyleSheet.create({
    button: {
        padding: 8,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#25252fff",
        borderRadius: 3
    },
})