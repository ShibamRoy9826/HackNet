//components
import HomeHeader from "@components/containers/HomeHeader";
import PostList from "@components/display/postList";
import { useTheme } from "@contexts/themeContext";
import { ActivityIndicator, KeyboardAvoidingView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

//react
import React from 'react';

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();

    return (
        <KeyboardAvoidingView behavior={"height"} style={{ backgroundColor: colors.background, paddingTop: insets.top, flex: 1 }}>

            <HomeHeader tY={0} h={50 + insets.top} pT={insets.top} />
            <PostList
                Header={
                    <View style={{ height: 20 + insets.top }}></View>
                }
                EmptyElement={
                    <ActivityIndicator
                        color={colors.secondary}
                        style={{ marginTop: 70 }}
                    />

                }
            />
        </KeyboardAvoidingView>
    );
}

