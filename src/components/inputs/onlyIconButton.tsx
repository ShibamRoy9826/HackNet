//components
import { useTheme } from "@contexts/themeContext";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";


type Props = {
    func: () => void;
    style?: StyleProp<ViewStyle>;
    icon: "account-plus-outline" | "arrow-left" | "magnify" | "whatsapp" | "facebook" | "reddit" | "link-variant" | "dots-horizontal" | "dots-vertical" | "delete";
    showBadgeAlert?: boolean;
}

export default function OnlyIconButton({ func, style, icon, showBadgeAlert }: Props) {
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
            {
                showBadgeAlert ?
                    <MaterialDesignIcons style={{ position: "absolute", top: 4, right: 2, zIndex: 2 }} name={"circle"} color={colors.primary} size={10} />
                    :
                    null
            }
        </Pressable>
    )

}
