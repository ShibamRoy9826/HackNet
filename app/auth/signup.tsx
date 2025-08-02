import {Button} from "@react-navigation/elements";
import {Text,View,StyleSheet,Pressable, Linking} from "react-native";
import InputBox from "../components/inptField";
import {useState} from "react";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";


// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCt8TVtsi-evqpVuET6MSwol1MLemhljaQ",
//   authDomain: "hacknet-4103f.firebaseapp.com",
//   projectId: "hacknet-4103f",
//   storageBucket: "hacknet-4103f.firebasestorage.app",
//   messagingSenderId: "417874103501",
//   appId: "1:417874103501:web:ea0b51820e3c38c452ad84",
//   measurementId: "G-W9VBFVMR2N"
// };
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


export default function SignUpScreen({navigation}){
    const [username,setUserName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [confirmpassword,setCpassword]=useState("");
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>
                Sign Up
            </Text>
            <Text style={styles.subHeading}>
                Get ready to be one of hackers!
            </Text>

            <View style={styles.fieldContainer}>
                <InputBox secure={false} value={username} valueFn={setUserName} color="#8492a6" icon="account-circle" placeholder="Your Name" type="emailAddress"/>
                <InputBox secure={false} value={email} valueFn={setEmail} color="#8492a6" icon="email" placeholder="Your Email" type="emailAddress"/>
                <InputBox secure={true} value={password} valueFn={setPassword} color="#8492a6" icon="key" placeholder="Your Password" type="password"/>
                <InputBox secure={true} value={confirmpassword} valueFn={setCpassword} color="#8492a6" icon="key" placeholder="Confirm Password" type="password"/>
            </View>
            <Button color="white" style={styles.button} onPressIn={()=>{navigation.navigate("Home")}}>
                Create Account
            </Button>

            <Text style={styles.smallTxt}>Already have an account? <Text style={styles.signupBtn} onPress={()=>{navigation.navigate("Login")}}>Login here</Text></Text>

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
               Sign Up With Slack 
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
    inputBox:{
       backgroundColor:"#233345ff",
       borderRadius:12,
       margin:10,
       width:"80%",
       paddingHorizontal:12,
       color:"white",
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
        color:"#338eda",
        textDecorationLine:"underline",
        fontSize:15
    }
})
