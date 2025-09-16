import CustomText from "@components/display/customText";
import IconButton from "@components/inputs/IconButton";
import OnlyIconButton from "@components/inputs/onlyIconButton";
import { useTheme } from "@contexts/themeContext";
import { useRouter } from "expo-router";
import { Image, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NotFound() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    function goBack() {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/(tabs)/home");
        }
    }
    return (
        <View style={{ flex: 1, width: "100%", height: "100%", backgroundColor: colors.background }}>
            <View style={{ position: "absolute", top: insets.top, left: 20, zIndex: 5, flexDirection: "row", alignItems: "center" }}>
                <OnlyIconButton icon="arrow-left" func={() => { router.back() }} style={{}} />
                <CustomText style={{ color: colors.text, left: 20, fontSize: 18, top: 0, fontWeight: 700 }}>
                    Not Found (404)
                </CustomText>
            </View>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
                <Image
                    source={require("@assets/images/confused_orpheus.png")}
                    style={{ height: 141, width: 197, marginBottom: 20 }}
                />

                <CustomText style={{ color: colors.text, fontSize: 20, fontWeight: 700, textAlign: "center", marginBottom: 10 }}>
                    Orpheus couldn't find this page :(
                </CustomText>
                <CustomText style={{ color: colors.muted, fontSize: 15, textAlign: "center" }}>
                    Maybe you came to a page
                </CustomText>
                <CustomText style={{ color: colors.muted, fontSize: 15, textAlign: "center", marginBottom: 10 }}>
                    which does't exist anymore...
                </CustomText>

                <View style={{ flexDirection: "row", gap: 10 }}>
                    <IconButton
                        text="Go Back"
                        func={() => { goBack() }}
                        icon="arrow-left"
                    />
                </View>
            </View>
        </View>


    )
}