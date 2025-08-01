import { ScrollView,Text} from "react-native";

export default function NewPostScreen({navigation}){
    return (
        <ScrollView style={{backgroundColor:"#17171d",flex:1,paddingTop:50,paddingBottom:100}}>
            <Text style={{color:"white",fontSize:20}}>Make a new post here!(new post page)</Text>
        </ScrollView>
    );
}


const styles={

}