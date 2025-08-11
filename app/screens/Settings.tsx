import { View,ScrollView,Text,StyleSheet, Pressable} from "react-native";
import { signOut } from "firebase/auth";
import {auth} from '../auth/firebase'


export default function SettingsScreen({navigation}){
    function logout(){
        signOut(auth).then(()=>{
            navigation.navigate("Login");
        }).catch((e)=>{
            console.log("ERROR::: ",e.code,e.message)
        })
    }
    return (
        <View style={{backgroundColor:"#17171d",flex:1,paddingTop:10,paddingBottom:30,alignItems:"center"}}>

            <ScrollView style={styles.listContainer} contentContainerStyle={{alignContent:"center",alignItems:"center"}}>
                <Pressable onPress={logout} style={styles.button}>
                    <Text>Sign Out</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}

const styles=StyleSheet.create({
    listContainer:{
        width:'95%',
        marginVertical:5,
        borderRadius:12,
        borderWidth:StyleSheet.hairlineWidth,
        borderColor:"#444456ff",
    },
    button:{
        backgroundColor:"#ec3750",
        elevation:10,
        marginVertical:15,
        display:"flex",
        flexDirection:"row",
        paddingVertical:10,
        paddingHorizontal:18,
        borderRadius:15,
        alignItems:"center",
        justifyContent:"center",
        width:"30%",
    },

});