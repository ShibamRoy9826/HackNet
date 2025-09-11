import CustomText from "@components/display/customText";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface Props {
    options: string[],
    iconList: ("earth" | "account-group" | "account" | "post" | "message" | "heart" | "email-mark-as-unread" | "sticker-check"
    )[],
    selected: string,
    setSelected: (a: string) => void,
    vertical?: boolean,
    style?: StyleProp<ViewStyle>
}

export default function RadioBtn({ iconList, style, vertical, setSelected, selected, options }: Props) {
    return (
        <View style={[style, styles.container, { flexDirection: vertical ? "column" : "row" }]}>
            {
                options.map((e: string, i: number) => (
                    <Pressable key={i} style={[styles.btn, { backgroundColor: (selected === e) ? "#ec3750" : "#1f2226ff" }]} onPress={() => { setSelected(e) }}>
                        <MaterialDesignIcons name={iconList[i]} size={15} color={"white"} style={{ width: "auto" }} />
                        <CustomText style={styles.btnTxt}>
                            {e}
                        </CustomText>
                    </Pressable>
                ))
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%"
    },
    btn: {
        height: "auto",
        marginVertical: 10,
        marginHorizontal: 7,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 10,
        transitionDuration: "0.5s",
        flexDirection: "row",

        borderColor: "#444456ff",
        borderWidth: StyleSheet.hairlineWidth
    },
    btnTxt: {
        color: "white",
        fontSize: 13,
        width: "auto",
        textAlign: "center",
        marginLeft: 5
    }
});