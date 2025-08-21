//components
import { View, ScrollView, StyleSheet, } from "react-native";

//types
import { AppStackParamList } from "../utils/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import NothingHere from "../components/display/nothing";

type Props = NativeStackScreenProps<AppStackParamList, 'Notifications'>;

export default function NotificationScreen({ navigation }: Props) {
    return (
        <View style={{ backgroundColor: "#17171d", flex: 1, paddingTop: 10, paddingBottom: 30, alignItems: "center" }}>

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