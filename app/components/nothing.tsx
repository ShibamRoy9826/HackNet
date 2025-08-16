import {View,Image,Text,StyleSheet,} from 'react-native';

interface Props{
    text?:string
}

export default function NothingHere({text}:Props){
    return(
        <View style={{justifyContent:"center",alignItems:"center",flex:1}}>
            <Image
                source={require("../../assets/images/empty-box.png")}
                style={{ borderRadius: 50, width: 70, height: 70, marginHorizontal: 10 ,marginVertical:40}}
            />
            <Text style={styles.subtxt}>{text?text:"There's nothing here...."}</Text>
        </View>
    )
}

const styles=StyleSheet.create({
    subtxt:{
        color:"#8492a6",
        fontSize:15,
        width:"100%",
        marginLeft:20,
        fontWeight:"normal",
        textAlign:"center"
    },
})