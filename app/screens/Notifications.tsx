import { View, ScrollView, StyleSheet, } from "react-native";
import FriendElement from "../components/friendElement";

//types
import { AppStackParamList } from "../utils/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<AppStackParamList, 'Notifications'>;

export default function NotificationScreen({ navigation }: Props) {
    return (
        <View style={{ backgroundColor: "#17171d", flex: 1, paddingTop: 10, paddingBottom: 30, alignItems: "center" }}>

            <ScrollView style={styles.listContainer}>
                <FriendElement username="Cool person" lastMessage="Hey there! nice to meet you" />
                <FriendElement username="Hacker 3" lastMessage="Hey there! nice to meet you" />
                <FriendElement username="Random Guy" lastMessage="Hey there! nice to meet you" />
                <FriendElement username="Cool person" lastMessage="Hey there! nice to meet you" />
                <FriendElement username="Hacker 3" lastMessage="Hey there! nice to meet you" />
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