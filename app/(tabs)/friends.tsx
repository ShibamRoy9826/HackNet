//components
import { View, ScrollView, StyleSheet } from "react-native";
import CustomText from "@/components/display/customText";
import InputBox from "@/components/inputs/inptField";
import OnlyIconButton from "@/components/inputs/onlyIconButton";

//react
import { useState } from "react";

//typecasting
import NothingHere from "@/components/display/nothing";


export default function FriendsScreen() {
    const [search, setSearch] = useState("");
    return (
        <View style={{ backgroundColor: "#17171d", flex: 1, paddingTop: 50, paddingBottom: 100, alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
                <CustomText style={{ color: "white", fontSize: 20, textAlign: "center", fontWeight: "bold", marginVertical: 10, marginLeft: "10%" }}>Your Friends</CustomText>
                <OnlyIconButton
                    icon="account-plus-outline"
                    func={() => { }}
                    style={{ marginLeft: "auto", marginRight: 30 }}
                />
            </View>

            <InputBox secure={false} value={search} valueFn={setSearch} color="white" icon="magnify" type="none" placeholder="Search your friends here" />

            <ScrollView style={styles.listContainer}>
                <NothingHere
                    text="You have no friends... Go make some!"
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        width: '95%',
        marginVertical: 25,
        borderRadius: 12,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#444456ff",
    }

});