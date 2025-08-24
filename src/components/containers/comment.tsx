//components
import CustomText from '@/components/display/customText';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { Image, Pressable, StyleSheet, View } from 'react-native';

//firestore
import { Timestamp } from 'firebase/firestore';

//func
import { calcTime } from '@/utils/stringTimeUtils';
import { useRouter } from 'expo-router';

type Prop = {
    uid: string;
    imgSrc: string;
    displayName: string;
    timestamp: Timestamp;
    message: string;
}

export default function Comment({ uid, imgSrc, displayName, timestamp, message }: Prop) {
    const nav = useRouter();

    function redirectToProfile() {
        nav.push(`/(tabs)/profile/${uid}`);
    }
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
                        <Pressable style={{ top: 5, right: 0, padding: 5, position: "absolute" }}>
                            <MaterialDesignIcons name="dots-vertical" color="#5f6878" size={25} />
                        </Pressable>
                    </View>

                    <CustomText style={styles.message}>{message}</CustomText>
                </View>
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
                <Pressable style={{ padding: 5, flexDirection: "row", alignItems: "center" }}>
                    <MaterialDesignIcons name="thumb-up-outline" color="#5f6878" size={25} />
                    <CustomText style={{ color: "#8492a6", marginLeft: 5 }}>0</CustomText>
                </Pressable>
                <Pressable style={{ padding: 5, flexDirection: "row", alignItems: "center" }}>
                    <MaterialDesignIcons name="thumb-down-outline" color="#5f6878" size={25} />
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