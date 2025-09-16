//components
import CustomText from '@components/display/customText';
import CustomPressable from '@components/inputs/customPressable';
import { Image, StyleSheet, ToastAndroid, View } from 'react-native';

//firestore
import { Timestamp } from 'firebase/firestore';

//func
import ThreeDots from '@components/display/threeDots';
import {
    deleteComment
} from '@utils/commentUtils';


import { useTheme } from '@contexts/themeContext';
import { calcTime } from '@utils/stringTimeUtils';
import { useRouter } from 'expo-router';

type Prop = {
    id: string;
    postId: string;
    uid: string;
    imgSrc: string;
    displayName: string;
    timestamp: Timestamp;
    message: string;
}

export default function Comment({ id, postId, uid, imgSrc, displayName, timestamp, message }: Prop) {
    const { colors } = useTheme();
    const nav = useRouter();

    function redirectToProfile() {
        nav.push(`/(tabs)/profile/${uid}`);
    }

    const styles = StyleSheet.create({
        listContainer: {
            width: '95%',
            marginVertical: 5,
            borderRadius: 12,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border
        },
        commentContainer: {
            position: "relative",
            paddingHorizontal: 10,
            paddingVertical: 5,
            width: "100%",
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.border
        },
        username: {
            fontSize: 15,
            fontWeight: 600,
            color: colors.secondary,
            textAlign: "left",
            width: "auto",
            marginBottom: 5
        },
        message: {
            fontSize: 13,
            color: colors.text,
            textAlign: "left",
            width: "auto"
        },
        subtxt: {
            fontSize: 13,
            color: colors.smallText,
            textAlign: "left",
            position: "static",
            width: "auto",
        },
        detailsContainer: {
            padding: 15,
            display: "flex",
            width: "80%",
            justifyContent: "center",
            alignItems: "flex-start"
        }

    });
    return (
        <View style={styles.commentContainer}>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <View style={{ alignItems: "center", justifyContent: "flex-start", width: "auto", height: "100%", marginTop: 25 }}>
                    <CustomPressable onPress={() => { redirectToProfile() }}>
                        <Image source={{ uri: imgSrc }} style={{ borderRadius: 50, width: 40, height: 40 }} />
                    </CustomPressable>
                </View>
                <View style={styles.detailsContainer}>
                    <View style={{ flexDirection: "row", alignContent: "center", position: "static" }}>
                        <CustomPressable onPress={() => { redirectToProfile() }}>
                            <CustomText style={styles.username}>{displayName}</CustomText>
                        </CustomPressable>
                        <CustomText style={[styles.subtxt, { marginLeft: 20 }]}>{calcTime(timestamp)}</CustomText>
                        <View style={{ position: "absolute", right: 10, top: 10 }}>
                            <ThreeDots
                                data={[
                                    { text: "Delete comment", func: () => { deleteComment(postId, id); ToastAndroid.show("Comment deleted successfully", 3) }, icon: "delete" }
                                ]}
                            />
                        </View>
                    </View>
                    <CustomText style={styles.message}>{message}</CustomText>
                </View>
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
                {/* <CustomPressable style={{ padding: 5, flexDirection: "row", alignItems: "center" }} onPress={() => { handleLike }}>
                    <MaterialDesignIcons name={liked ? "heart" : "heart-outline"} color={liked ? colors.primary : "#5f6878"} size={25} />
                    <CustomText style={{ color: colors.card, marginLeft: 5 }}>{likeCount}</CustomText>
                </CustomPressable>
                {/* <CustomPressable style={{ padding: 5, flexDirection: "row", alignItems: "center" }} onPress={() => { setDislike(!dislike); dislike ? removeDislikeFromComment(postId, id, user ? user.uid : "") : dislikeComment(postId, id, user ? user.uid : ""); updateCount(); }} >
                    <MaterialDesignIcons name={dislike ? "thumb-down" : "thumb-down-outline"} color={dislike ? "#338eda" : "#5f6878"} size={25} />
                    <CustomText style={{ color: "#8492a6", marginLeft: 5 }}>{dislikeCount}</CustomText>
                </CustomPressable> */}
                {/* <CustomPressable style={{ padding: 5, flexDirection: "row", alignItems: "center" }}>
                    <CustomText style={{ color: colors.card, marginLeft: 5 }}>Reply</CustomText>
                </CustomPressable> */}
            </View>

        </View>
    );
}
