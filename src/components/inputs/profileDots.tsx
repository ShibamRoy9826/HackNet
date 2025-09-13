import { auth } from "@auth/firebase";
import ThreeDots from "@components/display/threeDots";
import { useTheme } from "@contexts/themeContext";
import { sendFriendRequest } from "@utils/userUtils";
import { StyleSheet, View, ViewStyle } from "react-native";

interface Props {
    user_id: string;
    style: ViewStyle
}

export default function ProfileDots({ style, user_id }: Props) {
    const user = auth.currentUser;
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        button: {
            zIndex: 5,
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

        <View style={[style, styles.button]} >
            <ThreeDots
                data={[
                    { text: "Follow", icon: "account-plus", func: () => { } },
                    { text: "Send Friend Request", icon: "account-group", func: () => { sendFriendRequest(user ? user.uid : "", user_id); } },
                    { text: "Report", icon: "exclamation", func: () => { } }
                ]}
                color="white"

            />
        </View>
    );
}
