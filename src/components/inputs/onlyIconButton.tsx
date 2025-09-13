//components
import { useTheme } from "@contexts/themeContext";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";


type Props = {
    func: () => void;
    style?: StyleProp<ViewStyle>;
    icon: "account-plus-outline" | "arrow-left" | "magnify" | "whatsapp" | "facebook" | "reddit" | "link-variant" | "dots-horizontal" | "dots-vertical";
}

export default function OnlyIconButton({ func, style, icon }: Props) {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        button: {
            elevation: 10,
            backgroundColor: colors.darkBackground,
            marginVertical: 5,
            display: "flex",
            flexDirection: "row",
            padding: 10,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 50,
            borderColor: colors.border,
            borderWidth: 1
        },
    })
    return (
        <Pressable style={[style, styles.button]} onPress={func}>
            <MaterialDesignIcons name={icon} size={20} color={colors.text} />
        </Pressable>
    )

}
