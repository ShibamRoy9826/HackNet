//components
import CustomText from '@components/display/customText';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { Image, Pressable, StyleSheet, ToastAndroid, View } from 'react-native';

//firestore
import { collection, doc, getCountFromServer, getDoc, Timestamp } from 'firebase/firestore';

//func
import { auth, db } from '@auth/firebase';
import ThreeDots from '@components/display/threeDots';
import { deleteComment, likeComment, removeLikeFromComment } from '@utils/otherUtils';
import { calcTime } from '@utils/stringTimeUtils';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

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
    const nav = useRouter();

    const [like, setLike] = useState(false);
    const [dislike, setDislike] = useState(false);

    const [likeCount, setLikeCount] = useState(0);
    const [dislikeCount, setDislikeCount] = useState(0);
    const user = auth.currentUser;

    function redirectToProfile() {
        nav.push(`/(tabs)/profile/${uid}`);
    }

    async function updateLikeCount() {
        const likes = await getCountFromServer(collection(db, "posts", postId, "comments", id, "likes"));
        setLikeCount(likes.data().count);
    }

    async function setDefaultLikeState() {
        const likeRef = doc(db, "posts", postId, "comments", id, "likes", uid);
        try {
            const likeSnap = await getDoc(likeRef);
            const liked = likeSnap.exists();
            return liked;
        }
        catch (e) {
            console.log(e, " there's an error...");
            return false;
        }
    }

    useEffect(() => {
        setDefaultLikeState()
    }, [])
    return (
        <View style={styles.commentContainer}>
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <View style={{ alignItems: "center", justifyContent: "flex-start", width: "auto", height: "100%", marginTop: 25 }}>
                    <Pressable onPress={() => { redirectToProfile() }}>
                        <Image source={{ uri: imgSrc }} style={{ borderRadius: 50, width: 40, height: 40 }} />
                    </Pressable>
                </View>
                <View style={styles.detailsContainer}>
                    <View style={{ flexDirection: "row", alignContent: "center", position: "static" }}>
                        <Pressable onPress={() => { redirectToProfile() }}>
                            <CustomText style={styles.username}>{displayName}</CustomText>
                        </Pressable>
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
                <Pressable style={{ padding: 5, flexDirection: "row", alignItems: "center" }} onPress={() => { setLike(!like); like ? removeLikeFromComment(postId, id, user ? user.uid : "") : likeComment(postId, id, user ? user.uid : ""); updateLikeCount(); }}>
                    <MaterialDesignIcons name={like ? "heart" : "heart-outline"} color={like ? "#ec3750" : "#5f6878"} size={25} />
                    <CustomText style={{ color: "#8492a6", marginLeft: 5 }}>{likeCount}</CustomText>
                </Pressable>
                <Pressable style={{ padding: 5, flexDirection: "row", alignItems: "center" }} onPress={() => { setDislike(!dislike); }} >
                    <MaterialDesignIcons name={dislike ? "thumb-down" : "thumb-down-outline"} color={dislike ? "#338eda" : "#5f6878"} size={25} />
                    <CustomText style={{ color: "#8492a6", marginLeft: 5 }}>0</CustomText>
                </Pressable>
                <Pressable style={{ padding: 5, flexDirection: "row", alignItems: "center" }}>
                    <CustomText style={{ color: "#8492a6", marginLeft: 5 }}>Reply</CustomText>
                </Pressable>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        width: '95%',
        marginVertical: 5,
        borderRadius: 12,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#444456ff",
    },
    commentContainer: {
        position: "relative",
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: "100%",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#444456ff"
    },
    username: {
        fontSize: 15,
        fontWeight: 600,
        color: "#338eda",
        textAlign: "left",
        width: "auto",
        marginBottom: 5
    },
    message: {
        fontSize: 13,
        color: "#a4b2c6ff",
        textAlign: "left",
        width: "auto"
    },
    subtxt: {
        fontSize: 13,
        color: "#a4b2c6ff",
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