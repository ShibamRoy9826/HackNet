//components
import NothingHere from "@/components/display/nothing";
import { ScrollView, StyleSheet, View, } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NotificationScreen() {
    const insets = useSafeAreaInsets();
    return (
        <View style={{ backgroundColor: "#17171d", flex: 1, paddingTop: insets.top, alignItems: "center" }}>
            <ScrollView style={styles.listContainer}>
                <NothingHere />
            </ScrollView>
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
    }

});