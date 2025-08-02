import { View,ScrollView,Text} from "react-native";
import InputBox from "../components/inptField";
import FriendElement from "../components/friendElement";
import {useState} from "react";

export default function FriendsScreen({navigation}){
    const [search,setSearch]=useState("");
    return (
        <View style={{backgroundColor:"#17171d",flex:1,paddingTop:50,paddingBottom:100,alignItems:"center"}}>
            <Text style={{color:"white",fontSize:20,textAlign:"center",fontWeight:"bold",marginVertical:10}}>Your Friends</Text>
            <InputBox secure={false} value={search} valueFn={setSearch} color="white" icon="magnify" type="none" placeholder="Search your friends here"/>

            <ScrollView style={{width:'100%',marginVertical:25,paddingHorizontal:10}}>
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

const styles={

}