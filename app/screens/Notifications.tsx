import { View,ScrollView,Text,StyleSheet, Pressable} from "react-native";
import FriendElement from "../components/friendElement";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

export default function NotificationScreen({navigation}){
    return (
        <View style={{backgroundColor:"#17171d",flex:1,paddingTop:10,paddingBottom:30,alignItems:"center"}}>

            <ScrollView style={styles.listContainer}>
                <FriendElement username="Cool person" lastMessage="Hey there! nice to meet you"/>
                <FriendElement username="Hacker 3" lastMessage="Hey there! nice to meet you"/>
                <FriendElement username="Random Guy" lastMessage="Hey there! nice to meet you"/>
                <FriendElement username="Cool person" lastMessage="Hey there! nice to meet you"/>
                <FriendElement username="Hacker 3" lastMessage="Hey there! nice to meet you"/>
            </ScrollView>
        </View>
    );
}

const styles=StyleSheet.create({
    listContainer:{
        width:'95%',
        marginVertical:5,
        borderRadius:12,
        borderWidth:StyleSheet.hairlineWidth,
        borderColor:"#444456ff",
    }

});