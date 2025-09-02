import CustomText from "@components/display/customText";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { checkFollow, followUser, unfollowUser } from "@utils/otherUtils";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

interface Props {
    username: string,
    bio: string,
    avatar: string,
    user_id: string
}
const bio_limit = 20;

export default function FollowBox({ avatar, username, bio, user_id }: Props) {
    const router = useRouter();
    let bio_mod = bio.slice(0, bio_limit) + "...";
    const [followed, setFollowed] = useState(false);

    async function followBtnWrapper() {
        if(followed){
            setFollowed(false);
            await unfollowUser(user_id);
        }else{
            setFollowed(true);
            await followUser(user_id);
        }
    }
    async function checkAndSetFollow() {
        const userFollows = await checkFollow(user_id);
        if (userFollows) {
            setFollowed(true);
        }
    }

    useEffect(() => {
        checkAndSetFollow();
    }, [])

    return (
        <View style={styles.friendBox}>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%", paddingHorizontal: 10 }}>
                <Pressable onPress={() => { router.push(`/(tabs)/profile/${user_id}`) }}>
                    <Image source={{ uri: avatar }} style={{ borderRadius: 50, width: 45, height: 45, margin: "auto" }} />
                </Pressable>
                <View style={styles.detailsContainer}>
                    <Pressable onPress={() => { router.push(`/(tabs)/profile/${user_id}`) }}>
                        <CustomText style={styles.username}>{username}</CustomText>
                        <CustomText style={styles.lastMessage}>{bio_mod}</CustomText>
                    </Pressable>
                </View>
                <View>
                    {
                        !followed ?
                            <Pressable style={styles.followBtn} onPress={followBtnWrapper}>
                                <CustomText style={{ color: "white", fontWeight: "bold" }}>Track</CustomText>
                                <MaterialDesignIcons name="plus-box" color="white" size={18} style={{ marginLeft: 10 }} />
                            </Pressable>
                            :
                            <Pressable style={styles.followActivatedBtn} onPress={followBtnWrapper}>
                                <CustomText style={{ color: "white", fontWeight: "bold" }}>Untrack</CustomText>
                                <MaterialDesignIcons name="account-minus" color="white" size={18} style={{ marginLeft: 10 }} />
                            </Pressable>

                    }
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    followActivatedBtn: {
        backgroundColor: '#b42c3eff',
        padding: 10,
        borderRadius: 12,
        flexDirection: "row"
    },
    followBtn: {
        backgroundColor: '#ec3750',
        padding: 10,
        borderRadius: 12,
        flexDirection: "row"
    },
    friendBox: {
        padding: 10,
        width: "100%",
        height: 80,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#444456ff",
        borderRadius: 12
    },
    username: {
        fontSize: 15,
        fontWeight: 600,
        color: "white",
        textAlign: "left",
        width: "100%"
    },
    lastMessage: {
        fontSize: 13,
        color: "#8492a6",
        textAlign: "left",
        width: "100%"
    },
    detailsContainer: {
        padding: 15,
        display: "flex",
        width: "60%",
        justifyContent: "center",
        alignItems: "flex-start"
    }

})