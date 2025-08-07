import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import {StyleSheet,ScrollView,Image,View,Text, Pressable} from "react-native";
import { useSafeAreaInsets} from 'react-native-safe-area-context';
import RadioBtn from "../components/radioBtn";
import {useState} from "react";

export default function HomeScreen({navigation}){
    const insets=useSafeAreaInsets();
    const [currTab,setCurrTab]=useState("Posts");
    return (
        <ScrollView style={{backgroundColor:"#17171d",flex:1,paddingTop:insets.top}}>
            <View style={{position:"relative",height:100}}>
                <Image source={require("../../assets/images/banner.jpeg")} style={{width:'100%',position:"absolute",height:"100%",borderBottomWidth:1,borderColor:"#338eda"}}/>
                <Image source={require("../../assets/images/pfp.jpg")} style={{position:"absolute",bottom:-30,left:20,width:70,height:70,borderRadius:50,borderWidth:2,borderColor:"#338eda"}}/>
            </View>
            <View style={{position:"relative",width:"100%"}}>
                <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"
                }}>

                    <View>
                        <Text style={{fontSize:25,color:"white",fontWeight:"bold",width:"100%",textAlign:"left",marginTop:40,marginLeft:20}}>Shibam Roy</Text>
                        <Text style={styles.subtxt}>@ShibamRoy9826</Text>
                    </View>
                    
                        <Pressable style={[styles.button,{flexDirection:"row",marginRight:40,marginTop:20}]}>
                            <Text style={{color:"white",fontWeight:"bold",marginRight:10}}>Edit Profile</Text>
                            <MaterialDesignIcons name="pencil-box-multiple" size={20} color={"white"}/>
                        </Pressable>
                </View>
                <Text style={[styles.subtxt,{color:"white",marginTop:20,paddingLeft:5,paddingRight:30}]}>Hello yall! I am the dev of this platform, a fellow hackclubber! I love programming and making useful tools</Text>
                <View style={{flexDirection:"row", width:"100%",alignItems:"center",justifyContent:"center",marginVertical:10}}>
                    <Text style={{fontSize:15,color:"white",fontWeight:"bold"}}>
                        50 <Text style={[styles.subtxt,{color:"#8492a6"}]}>Logs</Text>
                    </Text>

                    <Text style={{marginLeft:20,fontSize:15,color:"white",fontWeight:"bold"}}>
                        37 <Text style={[styles.subtxt,{color:"#8492a6"}]}>Trackers</Text>
                    </Text>

                    <Text style={{marginLeft:20,fontSize:15,color:"white",fontWeight:"bold"}}>
                        42 <Text style={[styles.subtxt,{color:"#8492a6"}]}>Tracking</Text>
                    </Text>
                </View>
            </View>
        

            <RadioBtn
            options={["Posts","Liked Posts"]}
            iconList={["post","heart"]}
            selected={currTab}
            setSelected={setCurrTab}
            style={{marginHorizontal:10}}
            />

            {currTab=="Posts" && (
            <ScrollView style={{width:'100%',marginTop:20,paddingHorizontal:10}}>
            </ScrollView>
            )}

            {currTab=="Liked Posts" && (
            <ScrollView style={{width:'100%',marginTop:20,paddingHorizontal:10}}>
            </ScrollView>
            )}

            <View style={{backgroundColor:"#8492a6",width:"100%",height:StyleSheet.hairlineWidth}}/>


        </ScrollView>
    );
}


const styles=StyleSheet.create({
    subtxt:{
        color:"#8492a6",
        fontSize:15,
        width:"100%",
        marginLeft:20,
        fontWeight:"normal"
    },
    button:{
        width:"auto",
        height:40,
        backgroundColor:'#338eda',
        padding:10,
        borderRadius:12,
        flexDirection:"row"
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
})
