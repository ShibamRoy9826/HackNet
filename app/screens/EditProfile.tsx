import {Pressable,Image,View,Text,TextInput,StyleSheet,ScrollView} from "react-native";
import {Button} from "@react-navigation/elements";
import { useSafeAreaInsets} from 'react-native-safe-area-context';
import {useState,useEffect,useRef} from "react";
import {getUserData} from "../auth/firebase";
import { doc,DocumentData, updateDoc} from "firebase/firestore";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import * as ImagePicker from 'expo-image-picker';
import {auth,db} from '../auth/firebase';
import ModalBox from "../components/modal";
import { useUserData } from "../contexts/userContext";

export default function EditProfileScreen({navigation}){

    const currUser=auth.currentUser;
    const {userData}=useUserData();

    const [image, setImage] = useState<string | null>(null);

    const [modalText,setModalText]=useState("");
    const [modalSubText,setModalSubText]=useState("");
    const [modalVisible,setModalVisible]=useState(false);
    const modalFnRef=useRef<()=>void>(()=>{});


    const insets=useSafeAreaInsets();


    const [username,setUserName]=useState("");
    const [avatar,setAvatar]=useState("");
    const [email,setEmail]=useState("");
    const [bio,setBio]=useState("");


    function alert(text:string,subtext:string,onClose?:()=>void){
        setModalVisible(true);
        setModalText(text);
        setModalSubText(subtext);

        modalFnRef.current=onClose||(()=>{});
    }
    const updateProfile=async ()=>{
        if(currUser){
            const userRef = doc(db, "users", currUser.uid);

            await updateDoc(userRef, {
                uid: currUser.uid,
                email: currUser.email,
                displayName: username,
                createdAt: new Date(),
                avatar: currUser.photoURL || null,
                num_trackers:0,
                num_tracking:0,
                num_logs:0,
                posts:[],
                liked_posts:[],
                friends:[],
                notifications:[],
                bio:bio

        }).then(()=>{alert('Updated Successfully',"Your details were updated, if you don't see them, try reopening the app",()=>{navigation.goBack()})}).catch((e)=>{alert("An error occured",e.message)})
        }
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    useEffect(()=>{
        if(userData){
            setUserName(userData.displayName ?? '');
            setEmail(userData.email??'');
            setBio(userData.bio??'');
            setAvatar(userData.avatar??'');
        }
    },[userData])

    return(
        <ScrollView style={[styles.container,{paddingTop:insets.top}]}>

        <ModalBox
        onClose={() => modalFnRef.current()}
        animation="slide"
        isVisible={modalVisible}
        setIsVisible={setModalVisible}
        text={modalText}
        subtext={modalSubText}
        />

            <View style={styles.fieldContainer}>
                <Image source={userData?.avatar?{uri:userData.avatar}:require("../../assets/images/pfp.jpg")} style={{borderRadius:50, width:60,height:60,marginHorizontal:10}}/>

            <View style={{alignItems:"center",justifyContent:"center",width:"100%"}}>
                        <Pressable style={[styles.button,{flexDirection:"row",marginRight:40,marginTop:20}]} onPress={pickImage}>
                             <Text style={{color:"white",fontWeight:"bold",marginRight:10}}>Edit Avatar</Text>
                            <MaterialDesignIcons name="pencil-box-multiple" size={20} color={"white"}/>
                        </Pressable>
            </View>

                <Text style={styles.label}>Email:</Text>
                <TextInput style={styles.inputBoxDisabled} value={email} onChangeText={setEmail} editable={false}></TextInput>

                <Text style={styles.label}>Display Name:</Text>
                <TextInput style={styles.inputBox} value={username} onChangeText={setUserName}></TextInput>
                
                <Text style={styles.label}>Bio:</Text>
                <TextInput style={[styles.inputBox,{height:"40%"}]} value={bio} onChangeText={setBio} textAlignVertical="top" multiline={true}></TextInput>

            </View>
            <View style={{alignItems:"center",justifyContent:"center",width:"100%",marginTop:"10%"}}>
                <Button color="white" style={styles.button} onPressIn={updateProfile}>
                    Save
                </Button>
            </View>

        </ScrollView>
    );
}


const styles=StyleSheet.create({
    label:{
        color:"white",
        textAlign:"left",
        width:"100%",
        paddingHorizontal:30
    },
    container:{
        backgroundColor:"#17171d",
        flex:1
    },
    fieldContainer:{
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        width:"100%"
    },
    inputBox:{
       backgroundColor:"#292932ff",
       borderRadius:12,
       margin:10,
       width:"80%",
       paddingHorizontal:12,
       color:"white",
       display:"flex",
       flexDirection:"row",
       alignItems:"center",
       justifyContent:"flex-start",
       borderColor:"#444456ff",
       borderWidth:StyleSheet.hairlineWidth
    },
    inputBoxDisabled:{
       backgroundColor:"#3b3b47ff",
       borderRadius:12,
       margin:10,
       width:"80%",
       paddingHorizontal:12,
       color:"white",
       display:"flex",
       flexDirection:"row",
       alignItems:"center",
       justifyContent:"flex-start",
       borderColor:"#444456ff",
       borderWidth:StyleSheet.hairlineWidth
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
        borderRadius:15,
        alignItems:"center",
        justifyContent:"center"
    },
})