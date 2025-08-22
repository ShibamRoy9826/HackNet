//components
import { ViewStyle, Pressable, StyleProp, StyleSheet } from "react-native"
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons"


type Props = {
    func: () => void;
    style?: StyleProp<ViewStyle>;
    icon: "account-plus-outline" | "arrow-left" | "magnify";
}

export default function OnlyIconButton({ func, style, icon }: Props) {
    return (
        <Pressable style={[style, styles.button]} onPress={func}>
            <MaterialDesignIcons name={icon} size={20} color={"white"} />
        </Pressable>
    )

}

const styles = StyleSheet.create({
    button: {
        elevation: 10,
        backgroundColor: "#282832ff",
        marginVertical: 5,
        display: "flex",
        flexDirection: "row",
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        borderColor: "#25252fff",
        borderWidth: 1
    },
})