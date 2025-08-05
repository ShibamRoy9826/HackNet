import {Button} from "@react-navigation/elements";
import {Text,View,StyleSheet,Pressable} from "react-native";
import InputBox from "../components/inptField";
import {useState,useRef} from "react";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import {createUserWithEmailAndPassword, sendEmailVerification, updateProfile} from "firebase/auth";
import {auth} from './firebase';
import ModalBox from "../components/modal";

function isValidEmail(email:string){
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

export default function SignUpScreen({navigation}){

    const [username,setUserName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [confirmpassword,setCpassword]=useState("");

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

    const registerUser = async (email:string, password:string, name:string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, {
            displayName: name,
            photoURL: 'https://i.pinimg.com/736x/15/0f/a8/150fa8800b0a0d5633abc1d1c4db3d87.jpg' 
        });

        await sendEmailVerification(user).then(()=>console.log("SENT EMAIL ADDRESS!")).catch((e)=>console.log("BIIIIIGGG  PROBLEMMM HERE!!!!",e));

    };


    function createUser(){
        if(password!=confirmpassword){
            alert("Failed","Passwords don't match! Please re-enter")
        }else if(username==""){
            alert("Failed","Username Can't be empty! You can't be that much anonymous")
        }else if(password==""){
            alert("Failed","Password can't be empty! You don't want other hackers to hack into it!")
        }else if(email==""){
            alert("Failed","Email can't be empty! You will be in problem if you forget the password")
        }
        else if(!isValidEmail(email)){
            alert("Failed","Please enter a valid email! I swear I won't sell it...")
        }

        // Password checks
        else if(!(password.length>=8)){
            alert("Failed","Password must have 8 characters! Including symbols, numbers and alphabets")
        }
        else if(!(/[^a-zA-Z0-9]/.test(password))){
            alert("Failed","Password doesn't have symbols, make it secure bruh...")
        }
        else if(!(/\d/.test(password))){
            alert("Failed","Password doesn't have numbers, make it secure bruh...")
        }
        
        else{
            registerUser(email,password,username).then(
                ()=>{
                    alert("Success!","Further instructions for verification have been sent to your mail",()=>{navigation.navigate("Login")});

                }
            ).catch(
                (error)=>{
                    if (error.code === 'auth/email-already-in-use') {
                        alert("Failed","Email already in use, please use some other email! If you recently tried to sign up, check your email for verification")
                    }

                    if (error.code === 'auth/invalid-email') {
                        alert("Failed",'Hey, That email address is invalid!');
                    }
                }
            )
        }
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
            <Button color="white" style={styles.button} onPressIn={createUser}>
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

const styles=StyleSheet.create(
    {
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
}
);
