import { Switch,StyleSheet,View, Text, TextInput,Image,Pressable} from "react-native";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import {useState} from "react";
import RadioBtn from "../components/radioBtn";
import { Button } from "@react-navigation/elements";


export default function FriendsScreen({navigation}){
    const [title,setTitle]=useState("");
    const [selectedView,setSelectedView]=useState("Everyone");
    const [comments,setComments]=useState(true);

    return (
        <View style={{backgroundColor:"#17171d",flex:1,paddingTop:50,paddingBottom:100,alignItems:"center"}}>
            <View style={{flexDirection:"row",alignItems:"center",justifyContent:"flex-start",width:"100%"}}>
                <Image source={require("../../assets/images/pfp.jpg")} style={{marginHorizontal:10,borderRadius:50, width:30,height:30}}/>
                <Text style={{color:"white",fontSize:20,textAlign:"center",fontWeight:"bold",marginLeft:10,marginVertical:10}}>Create New Post</Text>
                <MaterialDesignIcons name={"plus-box"} size={20} color={"white"} style={{marginLeft:10}}/>
            </View>
            <TextInput value={title} onChangeText={setTitle} textAlignVertical="top" multiline={true} style={styles.fieldContainer} placeholder="Have something to share?" placeholderTextColor={"#8492a6"}/>

            {/* Media */}

            <View style={{flexDirection:"row",alignItems:"flex-start",width:"100%",paddingLeft:40,marginBottom:20}}>
                <Pressable style={{padding:8,borderWidth:StyleSheet.hairlineWidth,borderColor:"#25252fff",borderRadius:3}}>
                    <MaterialDesignIcons name="file-image" color="#5f6878" size={25}/>
                </Pressable>
                <Pressable style={{padding:8,borderWidth:StyleSheet.hairlineWidth,borderColor:"#25252fff",borderRadius:3}}>
                    <MaterialDesignIcons name="file-gif-box" color="#5f6878" size={25}/>
                </Pressable>
            </View>

            
            {/* Other Options */}
            <Text style={styles.label}>Who Can View This?</Text>
            <RadioBtn
            options={["Everyone","Friends Only"]}
            iconList={["earth","account-group"]}
            selected={selectedView}
            setSelected={setSelectedView}
            style={{paddingLeft:30,marginVertical:15}}
            />

            <Text style={styles.label}>Comments</Text>
            <View style={{width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"flex-start",paddingLeft:40}}>
                <Switch
                trackColor={{false: '#8492a6', true: '#338eda'}}
                thumbColor={'#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={()=>{setComments(!comments)}}
                value={comments}
                />
                <Text style={styles.subtxt}>{(comments?"No one can comment on your post":"Others can comment on your post")}</Text>
            </View>

            <View style={{width:"100%",alignItems:"center",justifyContent:"center"}}>
                <Pressable style={styles.button} onPressIn={()=>{console.log("tried to post")}}>
                    <Text style={styles.btnTxt}>Post</Text> 
                    <MaterialDesignIcons name="send" color="white" size={20}/>
                </Pressable> 
            </View>
        </View>
    );
}

const styles=StyleSheet.create({
   fieldContainer:{
       backgroundColor:"#292932ff",
       borderRadius:12,
       marginVertical:10,
       width:"90%",
       height:"40%",
       paddingHorizontal:12,
       color:"white",
       display:"flex",
       flexDirection:"row",
       alignItems:"center",
       justifyContent:"flex-start",
       borderColor:"#444456ff",
       borderWidth:StyleSheet.hairlineWidth,
       fontSize:18
   },
   label:{
    fontSize:18,
    color:"white",
    width:"100%",
    textAlign:"left",
    paddingLeft:40,
    fontWeight:"bold",
   },
   subtxt:{
    color:"#8492a6",
    fontSize:15,
    marginLeft:5
   },
    btnTxt:{
        color:"white",
        fontSize:18,
        width:"auto",
        textAlign:"center",
        marginHorizontal:5
    },
    button:{
        height:"auto",
        width:"auto",
        marginVertical:10,
        marginHorizontal:7,
        borderRadius:8,
        paddingVertical:8,
        paddingHorizontal:10,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"#338eda"
    },

});