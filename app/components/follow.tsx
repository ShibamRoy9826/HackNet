import { View,StyleSheet,Image,Text,Pressable} from "react-native";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

interface Props{
    username:string,
    bio:string
}
export default function FollowBox({username,bio}:Props){
    return(
        <View style={styles.friendBox}>
            <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center",width:"100%",paddingHorizontal:10}}>
                <Image source={require("../../assets/images/pfp.jpg")} style={{borderRadius:50, width:45,height:45,margin:"auto"}}/>
                <View style={styles.detailsContainer}>
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.lastMessage}>{bio}</Text>
                </View>
                <View>
                    <Pressable style={styles.followBtn}>
                        <Text style={{color:"white",fontWeight:"bold"}}>Track</Text>
                        <MaterialDesignIcons name="plus-box" color="white" size={18} style={{marginLeft:10}}/>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles=StyleSheet.create({
    followBtn:{
        backgroundColor:'#338eda',
        padding:10,
        borderRadius:12,
        flexDirection:"row"
    },
    friendBox:{
        padding:10,
        width:"100%",
        height:80,
        borderWidth:StyleSheet.hairlineWidth,
        borderColor:"#444456ff"
    },
    username:{
        fontSize:15,
        fontWeight:600,
        color:"white",
        textAlign:"left",
        width:"100%"
    },
    lastMessage:{
        fontSize:13,
        color:"#8492a6",
        textAlign:"left",
        width:"100%"
    },
    detailsContainer:{
        padding:15,
        display:"flex",
        width:"60%",
        justifyContent:"center",
        alignItems:"flex-start"
    }

})