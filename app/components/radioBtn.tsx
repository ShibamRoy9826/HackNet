import {Pressable, Text,View,StyleSheet,StyleProp,ViewStyle} from "react-native";
import MaterialDesignIcons from "@react-native-vector-icons/material-design-icons";

interface Props{
    options:string[],
    iconList:("earth"|"account-group")[],
    selected:string,
    setSelected:(a:string)=>void,
    vertical?:boolean,
    style?:StyleProp<ViewStyle>
}
export default function RadioBtn({iconList,style,vertical,setSelected,selected,options}:Props){
    return(
        <View style={[style,styles.container,{flexDirection:vertical?"column":"row"}]}>
            {
                options.map((e:string,i:number)=>(
                    <Pressable key={i} style={[styles.btn,{backgroundColor:(selected==e)?"#338eda":"#8492a6"}]} onPress={()=>{setSelected(e)} }>
                        <MaterialDesignIcons name={iconList[i]} size={15} color={"white"} style={{width:"auto"}}/>
                        <Text style={styles.btnTxt}>
                            {e}
                        </Text>
                    </Pressable>
                ))
            }
        </View>
    );
}

const styles=StyleSheet.create({
    container:{
        width:"100%"
    },
    btn:{
        height:"auto",
        marginVertical:10,
        marginHorizontal:7,
        borderRadius:8,
        paddingVertical:8,
        paddingHorizontal:10,
        transitionDuration:"0.5s",
        flexDirection:"row"
    },
    btnTxt:{
        color:"white",
        fontSize:13,
        width:"auto",
        textAlign:"center",
        marginLeft:5
    }
});