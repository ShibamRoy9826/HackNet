import { auth } from "@auth/firebase";
import ThreeDots from "@components/display/threeDots";
import { useTheme } from "@contexts/themeContext";
import { report } from "@utils/otherUtils";
import { followUser, sendFriendRequest, unfollowUser } from "@utils/userUtils";
import { StyleSheet, View, ViewStyle } from "react-native";

interface Props {
    user_id: string;
    style: ViewStyle;
    isFollowing?: boolean;
    setFollowing?: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

export default function ProfileDots({ setFollowing, isFollowing, style, user_id }: Props) {
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
                    isFollowing ?
                        {
                            text: "Unfollow", icon: "account-minus", func: () => {
                                unfollowUser(user_id);
                                setFollowing && setFollowing(false);
                            }
                        } :
                        {
                            text: "Follow", icon: "account-plus", func: () => {
                                followUser(user_id);
                                setFollowing && setFollowing(true);
                            }
                        }
                    ,
                    { text: "Send Friend Request", icon: "account-group", func: () => { sendFriendRequest(user ? user.uid : "", user_id); } },
                    {
                        text: "Report", icon: "exclamation", func: () => {
                            report("account", user_id, user ? user.uid : "", user_id)
                        }
                    }
                ]}
                color="white"

            />
        </View>
    );
}
