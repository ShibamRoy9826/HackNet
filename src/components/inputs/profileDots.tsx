import ThreeDots from "@components/display/threeDots";
import { StyleSheet, View, ViewStyle } from "react-native";

interface Props {
    user_id: string;
    style: ViewStyle
}

export default function ProfileDots({ style, user_id }: Props) {
    return (

        <View style={[style, styles.button]} >
            <ThreeDots
                data={[
                    { text: "Follow", icon: "account-plus", func: () => { } },
                    { text: "Send Friend Request", icon: "account-group", func: () => { } },
                    { text: "Report", icon: "exclamation", func: () => { } }
                ]}
                color="white"

            />
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        zIndex: 5,
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