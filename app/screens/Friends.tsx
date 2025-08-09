import { View,ScrollView,Text,StyleSheet, Pressable} from "react-native";
import InputBox from "../components/inptField";
import FriendElement from "../components/friendElement";
import {useState} from "react";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

export default function FriendsScreen({navigation}){
    const [search,setSearch]=useState("");
    return (
        <View style={{backgroundColor:"#17171d",flex:1,paddingTop:50,paddingBottom:100,alignItems:"center"}}>
            <View style={{flexDirection:"row",alignItems:"center",width:"100%"}}>
                <Text style={{color:"white",fontSize:20,textAlign:"center",fontWeight:"bold",marginVertical:10,marginLeft:"10%"}}>Your Friends</Text>
                <Pressable style={{marginLeft:"auto",marginRight:30}}>
                    <MaterialDesignIcons size={20} color={"white"} name="account-plus-outline"/>
                </Pressable>
            </View>

            <InputBox secure={false} value={search} valueFn={setSearch} color="white" icon="magnify" type="none" placeholder="Search your friends here"/>


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