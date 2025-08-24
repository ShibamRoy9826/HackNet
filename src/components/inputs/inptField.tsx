import { View, TextInput, StyleSheet } from "react-native";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Dispatch, SetStateAction } from "react";

interface Props {
    value: string,
    valueFn: Dispatch<SetStateAction<string>>,
    placeholder: string,
    type: "password" | "emailAddress" | "none" | undefined,
    icon: "email" | "key" | "account-circle" | "comment" | "magnify" | "format-title",
    color: string,
    secure: boolean
}

export default function InputBox({ secure, value, valueFn, color, icon, type, placeholder }: Props) {
    return (
        <View style={styles.fieldContainer}>
            <MaterialDesignIcons name={icon} size={20} color={color} />
            <TextInput secureTextEntry={secure} value={value} onChangeText={valueFn} maxLength={50} autoCapitalize="sentences" keyboardType="default" textContentType={type} style={styles.text} placeholder={placeholder} placeholderTextColor={"#8492a6"} />
        </View>
    );
}

const styles = StyleSheet.create({
    fieldContainer: {
        backgroundColor: "#292932ff",
        borderRadius: 12,
        margin: 10,
        width: "80%",
        height: "auto",
        paddingHorizontal: 12,
        color: "white",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        borderColor: "#444456ff",
        borderWidth: StyleSheet.hairlineWidth
    },
    text: {
        color: "white",
        textAlign: "left",
        paddingLeft: 10,
        width: '100%'
    }
});