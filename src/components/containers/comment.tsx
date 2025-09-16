//components
import CustomText from '@components/display/customText';
import CustomPressable from '@components/inputs/customPressable';
import { Alert, Image, StyleSheet, ToastAndroid, View } from 'react-native';

//firestore
import { Timestamp } from 'firebase/firestore';

//func
import ThreeDots from '@components/display/threeDots';
import {
    deleteComment
} from '@utils/commentUtils';

import { auth } from '@auth/firebase';
import CommentLikeButton from '@components/inputs/comment/likeBtn';
import { useTheme } from '@contexts/themeContext';
import { report } from '@utils/otherUtils';
import { calcTime } from '@utils/stringTimeUtils';
import { useRouter } from 'expo-router';
import { useState } from 'react';

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

    const [liked, setLiked] = useState(false);
    const currUser = auth.currentUser;

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
                            {
                                (uid === currUser?.uid) ?
                                    <ThreeDots
                                        data={[
                                            { text: "Delete comment", func: () => { deleteComment(postId, id); ToastAndroid.show("Comment deleted successfully", 3) }, icon: "delete" }
                                            ,
                                            {
                                                text: "Report", func: () => {

                                                    Alert.alert("Are you sure?", "Please don't make false reports, be sure before doing a report",
                                                        [
                                                            {
                                                                text: "Yes",
                                                                onPress: () => {
                                                                    report("comment", id, currUser ? currUser.uid : "", uid);
                                                                }
                                                            },
                                                            {
                                                                text: "No",
                                                                style: "cancel"
                                                            }
                                                        ]
                                                    )


                                                }, icon: "exclamation"
                                            }
                                        ]} /> :

                                    <ThreeDots
                                        data={[
                                            {
                                                text: "Report", func: () => {

                                                    Alert.alert("Are you sure?", "Please don't make false reports, be sure before doing a report",
                                                        [
                                                            {
                                                                text: "Yes",
                                                                onPress: () => {
                                                                    report("comment", id, currUser ? currUser.uid : "", uid);
                                                                }
                                                            },
                                                            {
                                                                text: "No",
                                                                style: "cancel"
                                                            }
                                                        ]
                                                    )


                                                }, icon: "exclamation"
                                            }
                                        ]} />

                            }

                        </View>
                    </View>
                    <CustomText style={styles.message}>{message}</CustomText>
                </View>
            </View>

            <View style={{ flexDirection: "row", gap: 10, marginLeft: 20 }}>
                <CommentLikeButton
                    liked={liked}
                    setLiked={setLiked}
                    userId={uid}
                    postId={postId}
                    commentId={id}
                />

            </View>

        </View>
    );
}
