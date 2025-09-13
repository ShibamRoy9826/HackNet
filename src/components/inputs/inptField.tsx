import { useTheme } from "@contexts/themeContext";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Dispatch, SetStateAction } from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface Props {
    value: string,
    valueFn: Dispatch<SetStateAction<string>>,
    placeholder: string,
    type: "password" | "emailAddress" | "none" | undefined,
    icon: "email" | "key" | "account-circle" | "comment" | "magnify" | "format-title",
    color: string,
    secure: boolean,
    maxLen?: number
}

export default function InputBox({ maxLen, secure, value, valueFn, color, icon, type, placeholder }: Props) {
    const { colors } = useTheme();
    const styles = StyleSheet.create({
        fieldContainer: {
            backgroundColor: colors.secondaryBackground,
            borderRadius: 12,
            margin: 10,
            width: "80%",
            paddingHorizontal: 12,
            color: colors.text,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            borderColor: colors.border,
            borderWidth: StyleSheet.hairlineWidth
        },
        text: {
            color: colors.text,
            textAlign: "left",
            paddingLeft: 10,
            flex: 1
        }
    });
    return (
        <View style={styles.fieldContainer}>
            <MaterialDesignIcons name={icon} size={20} color={color} />
            <TextInput secureTextEntry={secure} value={value} onChangeText={valueFn} maxLength={maxLen ? maxLen : 5000000} autoCapitalize="sentences" keyboardType="default" textContentType={type} style={styles.text} placeholder={placeholder} placeholderTextColor={colors.muted} />
        </View>
    );
}
