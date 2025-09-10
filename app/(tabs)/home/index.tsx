//components
import HomeHeader from "@components/containers/HomeHeader";
import PostList from "@components/display/postList";
import { KeyboardAvoidingView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

//react
import React from 'react';

export default function HomeScreen() {
    const insets = useSafeAreaInsets();

    return (
        <KeyboardAvoidingView behavior={"height"} style={{ backgroundColor: "#17171d", paddingTop: insets.top, flex: 1 }}>


            <HomeHeader tY={0} h={50 + insets.top} pT={insets.top} />
            <PostList
                Header={
                    <View style={{ height: 50 + insets.top }}></View>
                }
            />
        </KeyboardAvoidingView>
    );
}

