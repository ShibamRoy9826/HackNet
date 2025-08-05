import {StyleSheet,Text,Animated,Pressable,Image} from "react-native";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

interface Props{
    tY:any,
    h:number,
    pT:number
}

export default function HomeHeader({tY,h,pT}:Props){
    return(
            <Animated.View style={[styles.header,{height:h,paddingTop:pT,transform:[{translateY:tY}]}]}>
                <Image source={require("../../assets/images/pfp.jpg")} style={{borderRadius:50, width:30,height:30,marginHorizontal:10}}/>
                <Text style={{fontSize:18,color:"white",marginRight:"auto"}}> Ahoy, Hacker!</Text>
                <Pressable style={styles.button}>
                    <MaterialDesignIcons name="bell" color="white" size={25}/>
                </Pressable>
                <Pressable style={styles.button}>
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