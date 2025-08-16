import { Switch,StyleSheet,View, Text, TextInput,Image,Pressable} from "react-native";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";
import {useState,useRef} from "react";
import RadioBtn from "../components/radioBtn";
import {auth,db} from "../auth/firebase";
import { setDoc,doc} from "firebase/firestore";
import { useUserData } from "../contexts/userContext";
import * as ImagePicker from 'expo-image-picker';
import ModalBox from "../components/modal";

export default function NewPostScreen({navigation}){
    const [message,setMessage]=useState("");
    const [selectedView,setSelectedView]=useState("Everyone");
    const [comments_enabled,setComments]=useState(true);
    const [used_media, setUsedMedia]=useState(false)

    const [modalText, setModalText] = useState("");
    const [modalSubtext, setmodalSubtext] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const modalFnRef = useRef<() => void>(() => { });

    const user = auth.currentUser;
    const { userData } = useUserData();

    function alert(text: string, subtext: string, onClose?: () => void) {
        setModalVisible(true);
        setModalText(text);
        setmodalSubtext(subtext);

        modalFnRef.current = onClose || (() => { });
    }

    function gen_post_title(email:string){
        const userName=email.split("@")[0];
        const dateTime=new Date();
        const hr=dateTime.getHours();
        const mn=dateTime.getMinutes();
        const sec=dateTime.getSeconds();
        const day=dateTime.getDate();
        const month=dateTime.getMonth();
        const year=dateTime.getFullYear();

        return `${userName}-${day}-${month}-${year}_${hr}_${mn}_${sec}`;

    }
    const pickMedia = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            const rs= result.assets[0];
            setImgData(rs);
        } else {
            console.log("It got cancelled....");
        }
    };
    async function newLog(){
        if(user){
            await setDoc(doc(db, "posts", gen_post_title(user.email)), {
                uid:user.uid,
                likes:0,
                timestamp:new Date(),
                media:[],
                post_message:message,
                public:(selectedView=="Everyone")?true:false,
                users_liked:[],
                used_media:used_media,
                comments_enabled:comments_enabled,
                comments:[],
        }).then(()=>{alert("Success","Your log has been posted successfully!")}).catch((e)=>{alert("Error",`${e.code} ${e.message}. An error occured while posting :( `)})
        }
    }

    return (
        <View style={{backgroundColor:"#17171d",flex:1,paddingTop:50,paddingBottom:100,alignItems:"center"}}>
            <ModalBox
                onClose={() => modalFnRef.current()}
                animation="slide"
                isVisible={modalVisible}
                setIsVisible={setModalVisible}
                text={modalText}
                subtext={modalSubtext}
            />
            <View style={{flexDirection:"row",alignItems:"center",justifyContent:"flex-start",width:"100%"}}>
                <Image source={userData?.avatar?{uri:userData.avatar}:require("../../assets/images/pfp.jpg")} style={{marginHorizontal:10,borderRadius:50, width:30,height:30}}/>
                <Text style={{color:"white",fontSize:20,textAlign:"center",fontWeight:"bold",marginLeft:10,marginVertical:10}}>Create New Log</Text>
                <MaterialDesignIcons name={"plus-box"} size={20} color={"white"} style={{marginLeft:10}}/>
            </View>
            <TextInput value={message} onChangeText={setMessage} textAlignVertical="top" multiline={true} style={styles.fieldContainer} placeholder="Have something to share?" placeholderTextColor={"#8492a6"}/>

            {/* Media */}

            <View style={{flexDirection:"row",alignItems:"flex-start",width:"100%",paddingLeft:40,marginBottom:20}}>
                <Pressable style={{padding:8,borderWidth:StyleSheet.hairlineWidth,borderColor:"#25252fff",borderRadius:3}}>
                    <MaterialDesignIcons name="file-image" color="#5f6878" size={25}/>
                </Pressable>
                <Pressable style={{padding:8,borderWidth:StyleSheet.hairlineWidth,borderColor:"#25252fff",borderRadius:3}}>
                    <MaterialDesignIcons name="file-gif-box" color="#5f6878" size={25}/>
                </Pressable>
            </View>

            
            {/* Other Options */}
            <Text style={styles.label}>Who Can View This?</Text>
            <RadioBtn
            options={["Everyone","Friends Only"]}
            iconList={["earth","account-group"]}
            selected={selectedView}
            setSelected={setSelectedView}
            style={{paddingLeft:30,marginVertical:15}}
            />

            <Text style={styles.label}>Comments</Text>
            <View style={{width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"flex-start",paddingLeft:40}}>
                <Switch
                trackColor={{false: '#8492a6', true: '#ec3750'}}
                thumbColor={'#f4f3f4'}
                onValueChange={()=>{setComments(!comments_enabled)}}
                value={comments_enabled}
                />
                <Text style={styles.subtxt}>{(comments_enabled?"No one can comment on your post":"Others can comment on your post")}</Text>
            </View>

            <View style={{width:"100%",alignItems:"center",justifyContent:"center"}}>
                <Pressable style={styles.button} onPressIn={newLog}>
                    <Text style={styles.btnTxt}>Log</Text> 
                    <MaterialDesignIcons name="note-text" color="white" size={20}/>
                </Pressable> 
            </View>
        </View>
    );
}

const styles=StyleSheet.create({
   fieldContainer:{
       backgroundColor:"#292932ff",
       borderRadius:12,
       marginVertical:10,
       width:"90%",
       height:"40%",
       paddingHorizontal:12,
       color:"white",
       display:"flex",
       flexDirection:"row",
       alignItems:"center",
       justifyContent:"flex-start",
       borderColor:"#444456ff",
       borderWidth:StyleSheet.hairlineWidth,
       fontSize:18
   },
   label:{
    fontSize:18,
    color:"white",
    width:"100%",
    textAlign:"left",
    paddingLeft:40,
    fontWeight:"bold",
   },
   subtxt:{
    color:"#8492a6",
    fontSize:15,
    marginLeft:5
   },
    btnTxt:{
        color:"white",
        fontSize:15,
        fontWeight:"bold",
        width:"auto",
        textAlign:"center",
        marginHorizontal:5
    },
    button:{
        height:"auto",
        width:"auto",
        marginVertical:10,
        marginHorizontal:7,
        borderRadius:15,
        paddingVertical:8,
        paddingHorizontal:10,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"#ec3750"
    },

});