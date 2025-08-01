import { ScrollView,Text} from "react-native";

export default function HomeScreen({navigation}){
    return (
        <ScrollView style={{backgroundColor:"#17171d",flex:1,paddingTop:50,paddingBottom:100}}>
            <Text style={{color:"white",fontSize:20}}>This page is going to have your info (accounts page)</Text>
        </ScrollView>
    );
}


const styles={

}