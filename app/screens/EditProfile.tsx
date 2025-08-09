import {Pressable,Image,View,Text,TextInput,StyleSheet,ScrollView} from "react-native";
import {Button} from "@react-navigation/elements";
import { useSafeAreaInsets} from 'react-native-safe-area-context';
import {useState,useEffect} from "react";
import {getUserData} from "../auth/firebase";
import { DocumentData} from "firebase/firestore";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen(){
    const [image, setImage] = useState<string | null>(null);

    const insets=useSafeAreaInsets();

    const [userData,setUserData]=useState<DocumentData|null|undefined>(null);

    const [username,setUserName]=useState("");
    const [avatar,setAvatar]=useState("");
    const [email,setEmail]=useState("");
    const [bio,setBio]=useState("");

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
        getUserData("users").then((docData)=>{
            setUserData(docData);
            setUserName(docData.displayName);
            setEmail(docData.email);
            setBio(docData.bio);
            setAvatar(docData.avatar);
        });
    },[])

    return(
        <ScrollView style={[styles.container,{paddingTop:insets.top}]}>

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
                <Button color="white" style={styles.button}>
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