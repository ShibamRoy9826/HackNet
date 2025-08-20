import { FlatList, RefreshControl, StyleSheet, ScrollView, Image, View, Pressable } from "react-native";
import { useUserData } from '../contexts/userContext';
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import RadioBtn from "../components/radioBtn";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomText from "./customText";

import React, { useState } from 'react';

interface Props {
    userData: any;
    navigation: any;
}
export default function ProfileHeader({ userData, navigation }: Props) {
    const insets = useSafeAreaInsets();

    return (
        <View style={{ backgroundColor: "#17171d", flex: 1, paddingTop: insets.top }}>
            <View style={{ position: "relative", height: 100 }}>
                <Image source={require("../../assets/images/banner.jpeg")} style={{ width: '100%', position: "absolute", height: "100%", borderBottomWidth: 1, borderColor: "#ec3750" }} />
                <Image source={userData?.avatar ? { uri: userData.avatar } : require("../../assets/images/pfp.jpg")} style={{ position: "absolute", bottom: -30, left: 20, width: 70, height: 70, borderRadius: 50, borderWidth: 2, borderColor: "#ec3750" }} />
            </View>
            <View style={{ position: "relative", width: "100%" }}>
                <View style={{
                    flexDirection: "row", alignItems: "center", justifyContent: "space-between"
                }}>

                    <View>
                        <CustomText style={{ fontSize: 25, color: "white", fontWeight: "bold", width: "100%", textAlign: "left", marginTop: 40, marginLeft: 20 }}>{userData?.displayName}</CustomText>
                        <CustomText style={styles.subtxt}>@{userData?.email}</CustomText>
                    </View>

                    <Pressable style={[styles.button, { flexDirection: "row", marginRight: 40, marginTop: 20 }]} onPress={() => { navigation.navigate("EditProfile") }}>
                        <CustomText style={{ color: "white", fontWeight: "bold", marginRight: 10 }}>Edit Profile</CustomText>
                        <MaterialDesignIcons name="pencil-box-multiple" size={20} color={"white"} />
                    </Pressable>
                </View>
                <CustomText style={[styles.subtxt, { color: "white", marginTop: 20, paddingLeft: 5, paddingRight: 30 }]}>
                    {userData?.bio}
                </CustomText>
                <View style={{ flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "center", marginVertical: 10 }}>
                    <CustomText style={{ fontSize: 15, color: "white", fontWeight: "bold" }}>
                        {userData?.num_logs} <CustomText style={[styles.subtxt, { color: "#8492a6" }]}>Logs</CustomText>
                    </CustomText>

                    <CustomText style={{ marginLeft: 20, fontSize: 15, color: "white", fontWeight: "bold" }}>
                        {userData?.num_trackers} <CustomText style={[styles.subtxt, { color: "#8492a6" }]}>Trackers</CustomText>
                    </CustomText>

                    <CustomText style={{ marginLeft: 20, fontSize: 15, color: "white", fontWeight: "bold" }}>
                        {userData?.num_tracking} <CustomText style={[styles.subtxt, { color: "#8492a6" }]}>Tracking</CustomText>
                    </CustomText>
                </View>
            </View>

        </View>
    );
}


const styles = StyleSheet.create({
    subtxt: {
        color: "#8492a6",
        fontSize: 15,
        width: "100%",
        marginLeft: 20,
        fontWeight: "normal"
    },
    button: {
        width: "auto",
        height: 40,
        backgroundColor: '#ec3750',
        padding: 10,
        borderRadius: 12,
        flexDirection: "row"
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
