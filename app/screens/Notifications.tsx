import { View,ScrollView,Text,StyleSheet, Pressable} from "react-native";
import FriendElement from "../components/friendElement";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

export default function NotificationScreen({navigation}){
    return (
        <View style={{backgroundColor:"#17171d",flex:1,paddingTop:50,paddingBottom:100,alignItems:"center"}}>
            <View style={{flexDirection:"row",alignItems:"center",width:"100%"}}>
                <Pressable onPress={()=>{navigation.goBack()}} style={{marginRight:"auto"}}>
                    <MaterialDesignIcons name="arrow-left-bold" color="white" size={30}/>
                </Pressable>
                <Text style={{color:"white",fontSize:20,textAlign:"center",fontWeight:"bold",marginVertical:8}}>Your Notifications</Text>
            </View>

            <ScrollView style={styles.listContainer}>
                <FriendElement username="Random Guy" lastMessage="Hey there! nice to meet you"/>
                <FriendElement username="Cool person" lastMessage="Hey there! nice to meet you"/>
                <FriendElement username="Hacker 3" lastMessage="Hey there! nice to meet you"/>
                <FriendElement username="Random Guy" lastMessage="Hey there! nice to meet you"/>
                <FriendElement username="Cool person" lastMessage="Hey there! nice to meet you"/>
                <FriendElement username="Hacker 3" lastMessage="Hey there! nice to meet you"/>
                <FriendElement username="Random Guy" lastMessage="Hey there! nice to meet you"/>
                <FriendElement username="Cool person" lastMessage="Hey there! nice to meet you"/>
                <FriendElement username="Hacker 3" lastMessage="Hey there! nice to meet you"/>
                <FriendElement username="Random Guy" lastMessage="Hey there! nice to meet you"/>
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
        marginVertical:25,
        borderRadius:12,
        borderWidth:StyleSheet.hairlineWidth,
        borderColor:"#444456ff",
    }

});