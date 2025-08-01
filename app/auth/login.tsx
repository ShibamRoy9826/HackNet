import {Button} from "@react-navigation/elements";
import {Text,View,StyleSheet,Pressable, Linking} from "react-native";
import InputBox from "../components/inptField";
import {useState} from "react";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

export default function LoginScreen({navigation}){
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>
                Hack Net 
            </Text>
            <Text style={styles.subHeading}>
                Social media for teen hackers.
                Made By a hackclubber, for hackclubbers!
            </Text>

            <View style={styles.fieldContainer}>
                <InputBox secure={false} value={email} valueFn={setEmail} color="#8492a6" icon="email" placeholder="Your Email" type="emailAddress"/>
                <InputBox secure={true} value={password} valueFn={setPassword} color="#8492a6" icon="key" placeholder="Your Password" type="password"/>
                
            </View>
            <Text style={styles.forgotPass} onPress={()=>{Linking.openURL("https://google.com")}}>Forgot Password?</Text>
            <Button color="white" style={styles.button} onPressIn={()=>{navigation.navigate("Tabs")}}>
               Login
            </Button>

            <Text style={styles.smallTxt}>Don't have an account? <Text style={styles.signupBtn} onPress={()=>{navigation.navigate("SignUp")}}>Sign up here</Text></Text>

            <View
            style={{
                borderBottomColor: 'white',
                width:"80%",
                borderBottomWidth: 1,
                marginVertical:3
            }}
            >
            </View>

           <Text style={styles.subHeading}>
            or
            </Text> 


            <Pressable style={styles.button} onPress={()=>{navigation.navigate("Tabs")}}>
                <Text style={{color:"white", fontSize:15,marginRight:6}}>
               Login With Slack 
                </Text>
                <MaterialDesignIcons name="slack" size={20} color="white" />
            </Pressable>
        </View>
    );
};

const styles=StyleSheet.create({
    container:{
        backgroundColor:"#17171d",
        flex:1 ,
        display:"flex",
        alignItems:"center",
        justifyContent:"center"
    },
    heading:{
        color:"white",
        fontSize:30,
        fontWeight:"bold",
        textAlign:"center",
    },
    subHeading:{
        color:"#8492a6",
        fontSize:15,
        fontWeight:"normal",
        textAlign:"center",
        margin:10,
        marginBottom:"5%"
    },
    fieldContainer:{
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        width:"100%"
    },
    smallTxt:{
        fontSize:15,
        marginVertical:20,
        color:"#8492a6"
    },
    button:{
        backgroundColor:"#ec3750",
        elevation:10,
        marginVertical:5,
        display:"flex",
        flexDirection:"row",
        paddingVertical:10,
        paddingHorizontal:18,
        borderRadius:15
    },
    signupBtn:{
        color:"#4ea6f0",
        textDecorationLine:"underline",
        fontSize:15
    },
    forgotPass:{
        color:"#4ea6f0",
        textDecorationLine:"underline",
        fontSize:15,
        textAlign:"right",
        width:"100%",
        paddingRight:"10%",
        marginBottom:20
    }
})
