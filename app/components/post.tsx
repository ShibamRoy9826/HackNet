import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import {StyleSheet, View,Image ,Text, Pressable} from "react-native";
import {useState} from "react";
import InputBox from "./inptField";

interface Prop{
    username:string,
    timestamp:string
}

export default function Post({username,timestamp}:Prop){
    const [liked,setLiked]=useState(false);
    const [comment,setComment]=useState("");
    return(
        <View style={styles.postBox}>
            {/* OP details */}
            <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center",width:"100%",paddingHorizontal:10}}>
                <Image source={require("../../assets/images/pfp.jpg")} style={{borderRadius:50, width:45,height:45,margin:"auto"}}/>
                <View style={styles.detailsContainer}>
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.timestamp}>{timestamp}</Text>
                </View>
                <View>
                    <Pressable style={{padding:5,marginLeft:"auto"}}>
                        <MaterialDesignIcons name="dots-vertical" color="#5f6878" size={25}/>
                    </Pressable>
                </View>
            </View>
             {/* Posted content */}
            <Image source={require("../../assets/images/post.png")} style={{width:"100%",height:250,borderColor:"#25252fff",borderWidth:StyleSheet.hairlineWidth}}/>
            
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
        fontWeight:600,
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