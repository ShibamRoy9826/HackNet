import { View,ScrollView,TextInput,StyleSheet, Pressable,Text} from "react-native";
import {useState} from "react";
import FollowBox from "../components/follow";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import RadioBtn from "../components/radioBtn";
import Post from "../components/post";

export default function SearchScreen(){
    const [search,setSearch]=useState("");
    const [currTab,setCurrTab]=useState("Suggestions");
    return (
        <View style={{backgroundColor:"#17171d",flex:1,paddingTop:50,paddingBottom:100,alignItems:"center"}}>

        <View style={{flexDirection:"row",alignItems:"center"}}>

            <View style={styles.fieldContainer}>
                <TextInput value={search} onChangeText={setSearch} maxLength={50} autoCapitalize="none" textContentType={"none"} style={styles.text} placeholder={"Search HackNet"} placeholderTextColor={"#8492a6"}/>
            </View> 

            <Pressable style={styles.btn}>
                <MaterialDesignIcons name={"magnify"} size={20} color={"white"} />
            </Pressable>

        </View>

            <RadioBtn
            options={["Hackers","Posts","Suggestions"]}
            iconList={["account","post","message"]}
            selected={currTab}
            setSelected={setCurrTab}
            />

            {currTab=="Hackers" && (
            <ScrollView style={{width:'100%',marginVertical:25,paddingHorizontal:10}}>
                    <Text style={styles.heading}>Hackers you may be looking for</Text>
                    <FollowBox
                    username="Shibam"
                    bio="Hello yall i am the dev "
                    />
            </ScrollView>
            )}

            {currTab=="Posts" && (
            <ScrollView style={{width:'100%',marginVertical:25,paddingHorizontal:10}}>
                    <Text style={styles.heading}>Posts you may be looking for</Text>
                    <Post username="Shibam Roy" timestamp="Today at 12:00PM"/>
            </ScrollView>
            )}

            {currTab=="Suggestions" && (
            <ScrollView style={{width:'100%',marginVertical:25,paddingHorizontal:10}}>
                    <Text style={styles.heading}>Hackers you can follow</Text>
                    <FollowBox
                    username="Shibam"
                    bio="Hello yall i am the dev "
                    />
            </ScrollView>
            )}
        </View>

    );
}

const styles=StyleSheet.create({
   fieldContainer:{
       backgroundColor:"#292932ff",
       borderRadius:12,
       margin:10,
       width:"75%",
       paddingHorizontal:12,
       color:"white",
       display:"flex",
       flexDirection:"row",
       alignItems:"center",
       justifyContent:"flex-start",
       borderColor:"#444456ff",
       borderWidth:StyleSheet.hairlineWidth
   },
   text:{
    color:"white",
    textAlign:"left",
    paddingLeft:10
   },
   heading:{
    color:"white",
    textAlign:"left",
    paddingLeft:10,
    fontSize:20,
    fontWeight:"bold",
    marginBottom:20
   },
   btn:{
       backgroundColor:"#292932ff",
       borderRadius:10,
       margin:3,
       padding:10,
       color:"white",
       display:"flex",
       flexDirection:"row",
       alignItems:"center",
       justifyContent:"flex-start",
       borderColor:"#444456ff",
       borderWidth:StyleSheet.hairlineWidth
   }

});