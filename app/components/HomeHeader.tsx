import {StyleSheet,Text,Animated,Pressable,Image,Linking} from "react-native";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { useNavigation } from '@react-navigation/native';
import { useUserData } from "../contexts/userContext";

interface Props{
    tY:any,
    h:number,
    pT:number
}

export default function HomeHeader({tY,h,pT}:Props){
    const nav=useNavigation();
    
    const {userData} =useUserData();



    return(
            <Animated.View style={[styles.header,{height:h,paddingTop:pT,transform:[{translateY:tY}]}]}>
                <Image source={userData?.avatar?{uri:userData.avatar}:require("../../assets/images/pfp.jpg")} style={{borderRadius:50, width:30,height:30,marginHorizontal:10}}/>
                <Text style={{fontSize:18,color:"white",marginRight:"auto"}}> Ahoy, Hacker!</Text>
                <Pressable style={styles.button} onPress={()=>{nav.navigate('Notifications')}}>
                    <MaterialDesignIcons name="bell" color="white" size={25}/>
                </Pressable>
                <Pressable style={styles.button} onPress={()=>{nav.navigate('Settings')}}>
                    <MaterialDesignIcons name="cog-outline" color="white" size={25}/>
                </Pressable>
            </Animated.View>
    );
}

const styles=StyleSheet.create({
    button:{
        marginHorizontal:10
    },
    header:{
        margin:0,
        position:"absolute",
        backgroundColor:"#17171d",
        left:0,
        right:0,
        width:"100%",
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderColor:"#25252fff",
        paddingVertical:10,
        marginVertical:5,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"flex-end",
        elevation:4,
        zIndex:1,
    }
});