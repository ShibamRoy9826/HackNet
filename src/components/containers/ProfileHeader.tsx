//components
import { Image, StyleSheet, View } from "react-native";
import CustomText from "../display/customText";

//react
import { auth } from "@auth/firebase";
import { useRouter } from "expo-router";
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IconButton from "../inputs/IconButton";
import OnlyIconButton from "../inputs/onlyIconButton";

interface Props {
    userData: any;
    user_id?: string;
    sameUser?: boolean;
}

export default function ProfileHeader({ sameUser, user_id, userData }: Props) {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const user = auth.currentUser;
    return (
        <View style={{ backgroundColor: "#17171d", flex: 1, paddingTop: insets.top }}>
            {
                !sameUser ?
                    <OnlyIconButton
                        icon="arrow-left"
                        func={() => { router.back() }}
                        style={{ position: "absolute", zIndex: 2, elevation: 20, top: 30, left: 10 }}
                    /> :
                    <></>
            }

            <View style={{ position: "relative", height: 100 }}>
                <Image source={require("@assets/images/banner.jpeg")} style={{ width: '100%', zIndex: 1, position: "absolute", height: "100%", borderBottomWidth: 1, borderColor: "#ec3750" }} />
                <Image source={userData?.avatar ? { uri: userData.avatar } : require("@assets/images/pfp.jpg")} style={{ zIndex: 3, position: "absolute", bottom: -30, left: 20, width: 70, height: 70, borderRadius: 50, borderWidth: 2, borderColor: "#ec3750" }} />
            </View>
            <View style={{ position: "relative", width: "100%" }}>
                <View style={{
                    flexDirection: "row", alignItems: "center", justifyContent: "space-between"
                }}>
                    <View>
                        <CustomText style={{ fontSize: 25, color: "white", fontWeight: "bold", width: "100%", textAlign: "left", marginTop: 40, marginLeft: 20 }}>{userData?.displayName}</CustomText>
                        <CustomText style={styles.subtxt}>@{userData?.displayNameLower}</CustomText>
                    </View>
                    {
                        !sameUser ?
                            <IconButton
                                text="Track"
                                style={{ marginRight: 40, marginTop: 20 }}
                                func={() => { }}
                                icon="plus-box"
                            /> :
                            <IconButton
                                text="Edit Profile"
                                style={{ marginRight: 40, marginTop: 20 }}
                                func={() => { router.push("/(tabs)/profile/edit") }}
                                icon="pencil-box-multiple"
                            />

                    }
                </View>
                <CustomText style={[styles.subtxt, { color: "white", marginTop: 20, paddingLeft: 5, paddingRight: 30 }]}>
                    {userData?.bio}
                </CustomText>
                <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "center", marginVertical: 10 }}>
                    <CustomText style={styles.flexBox}>
                        {userData?.num_logs} <CustomText style={[styles.subtxt, { color: "#8492a6", marginLeft: 5 }]}>Logs</CustomText>
                    </CustomText>

                    <CustomText style={[{ marginLeft: 20 }, styles.flexBox]}>
                        {userData?.num_trackers} <CustomText style={[styles.subtxt, { color: "#8492a6", marginLeft: 5 }]}>Trackers</CustomText>
                    </CustomText>

                    <CustomText style={[{ marginLeft: 20 }, styles.flexBox]}>
                        {userData?.num_tracking} <CustomText style={[styles.subtxt, { color: "#8492a6", marginLeft: 5 }]}>Tracking</CustomText>
                    </CustomText>
                </View>
            </View>

        </View>
    );
}


const styles = StyleSheet.create({
    flexBox: {
        fontSize: 15,
        color: "white",
        fontWeight: "bold",
        alignContent: "center",
        justifyContent: "center"
    },
    subtxt: {
        color: "#8492a6",
        fontSize: 15,
        width: "100%",
        marginLeft: 20,
        fontWeight: "normal"
    },
    text: {
        color: "white",
        textAlign: "left",
        paddingLeft: 10
    },
    heading: {
        color: "white",
        textAlign: "left",
        paddingLeft: 10,
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20
    },
})
