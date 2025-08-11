import {Button} from "@react-navigation/elements";
import {Text,View,StyleSheet,Pressable, Linking,Alert} from "react-native";
import InputBox from "../components/inptField";
import {useState,useRef} from "react";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import { signInWithEmailAndPassword} from "firebase/auth";
import {auth} from './firebase';
import ModalBox from "../components/modal";


export default function LoginScreen({navigation}){
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const [modalText,setModalText]=useState("");
    const [modalSubText,setModalSubText]=useState("");
    const [modalVisible,setModalVisible]=useState(false);
    const modalFnRef=useRef<()=>void>(()=>{});
    
    function alert(text:string,subtext:string,onClose?:()=>void){
        setModalVisible(true);
        setModalText(text);
        setModalSubText(subtext);

        modalFnRef.current=onClose||(()=>{});
    }

function handleSlackLogin(){
    console.log("Tried slack login");
}
function handleLogin(){
    signInWithEmailAndPassword(auth,email,password).then(()=>{
        const user=auth.currentUser;
        if(user){
            if(!user.emailVerified){
                alert("Login Failed","Please check your email, a verification link has been sent. If you can't find it, check your spam folder");
            }else{
                navigation.replace("Tabs");
            }
        }else{
            alert("Login Failed","Something is wrong please try again!");
        }
    }).catch((e)=>{alert("Login Failed","Invalid credentials! Please try again")})
}
    return (
        <View style={styles.container}>

        <ModalBox
        onClose={() => modalFnRef.current()}
        animation="slide"
        isVisible={modalVisible}
        setIsVisible={setModalVisible}
        text={modalText}
        subtext={modalSubText}
        />
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
            <Text style={styles.forgotPass} onPress={()=>{navigation.navigate("ForgotPass")}}>Forgot Password?</Text>
            <Button color="white" style={[styles.button,{backgroundColor:"#ec3750"}]} onPressIn={handleLogin}>
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


            <Pressable style={[styles.button,{backgroundColor:"#8492a6"}]} onPress={handleSlackLogin}>
                <Text style={{color:"white", fontSize:15,marginRight:6}}>
               Login With Slack 
                </Text>
                <MaterialDesignIcons name="slack" size={20} color="white" />
            </Pressable>

            <Text style={{color:"#8492a6"}}>(Coming soon)</Text>
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
