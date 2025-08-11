import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import {StyleSheet, View,Image ,Text, Pressable} from "react-native";
import {useEffect, useState} from "react";
import InputBox from "./inptField";
import { getUserData } from "../auth/firebase";

interface Prop{
    uid:string,
    timestamp:string,
    message:string,
    used_media:boolean
}

export default function Post({used_media,message,uid,timestamp}:Prop){
    const [liked,setLiked]=useState(false);
    const [comment,setComment]=useState("");
    const [userPfp,setUserPfp]=useState("https://i.pinimg.com/736x/15/0f/a8/150fa8800b0a0d5633abc1d1c4db3d87.jpg");
    const [OPName,setOPName]=useState("Random User");


    useEffect(()=>{
        getOP();
    },[uid])

    async function getOP(){
        await getUserData("users",uid).then(
            (data)=>{
                if(data){
                    setUserPfp(data.avatar);
                    setOPName(data.displayName);
                }
            }
        );
    }

    return(
        <View style={styles.postBox}>
            {/* OP details */}
            <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center",width:"100%",paddingHorizontal:10}}>
                <Image source={{uri:userPfp}} style={{borderRadius:50, width:45,height:45,margin:"auto"}}/>
                <View style={styles.detailsContainer}>
                    <Text style={styles.username}>{OPName}</Text>
                    <Text style={styles.timestamp}>{timestamp}</Text>
                </View>
                <View>
                    <Pressable style={{padding:5,marginLeft:"auto"}}>
                        <MaterialDesignIcons name="dots-vertical" color="#5f6878" size={25}/>
                    </Pressable>
                </View>
            </View>
            <View style={{paddingVertical:20,borderColor:"#25252fff",borderTopWidth:StyleSheet.hairlineWidth,height:"auto"}}>
             {/* Posted content */}
            <Text style={{color:"white",height:"auto",fontSize:16,paddingHorizontal:20,paddingVertical:10}}>{message}</Text>
            {
                used_media &&(
                <Image source={require("../../assets/images/post.png")} style={{width:"100%",height:250}}/>
                )
            }
            </View>
            
            {/* Buttons */}
            <View style={{flexDirection:"row",paddingHorizontal:20,justifyContent:"flex-start",alignItems:"center",width:"auto"}}>
                <Pressable style={{padding:8}} onPress={()=>{setLiked(!liked)}}>
                    <MaterialDesignIcons name={liked?"heart":"heart-outline"} color={liked?"#ec3750":"#5f6878"} size={25}/>
                </Pressable>

                <Pressable style={{padding:8}}>
                    <MaterialDesignIcons name="comment" color="#5f6878" size={25}/>
                </Pressable>

                <Pressable style={{padding:8}}>
                    <MaterialDesignIcons name="share" color="#5f6878" size={25}/>
                </Pressable>
            </View>

            {/* add a comment*/}
            <View style={{flexDirection:"row",alignItems:"center",width:"100%"}}>

                <InputBox secure={false} value={comment} valueFn={setComment} color="#8492a6" icon="comment" type="none" placeholder="Comment here"/>
                <Pressable style={{padding:8}}>
                    <MaterialDesignIcons name="send" color="#5f6878" size={25}/>
                </Pressable>
            </View>

        </View>
    );
}

const styles=StyleSheet.create({
    postBox:{
        display:"flex",
        width:"100%",
        borderWidth:StyleSheet.hairlineWidth,
        borderColor:"#25252fff",
        paddingVertical:10,
        marginVertical:10
    },
    username:{
        fontSize:15,
        fontWeight:"bold",
        color:"white",
        textAlign:"left",
        width:"100%"
    },
    timestamp:{
        fontSize:13,
        color:"#8492a6",
        textAlign:"left",
        width:"100%"
    },
    detailsContainer:{
        padding:15,
        display:"flex",
        width:"80%",
        justifyContent:"center",
        alignItems:"flex-start"
    }
})