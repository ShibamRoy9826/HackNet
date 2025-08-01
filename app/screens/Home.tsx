import { ScrollView} from "react-native";
import Post from "../components/post";

export default function HomeScreen({navigation}){
    return (
        <ScrollView style={{backgroundColor:"#17171d",flex:1,paddingTop:20,paddingBottom:100}}>
            <Post username="Shibam Roy" timestamp="Today at 12:00PM"/>
            <Post username="Shibam Roy" timestamp="Today at 12:00PM"/>
            <Post username="Shibam Roy" timestamp="Today at 12:00PM"/>
            <Post username="Shibam Roy" timestamp="Today at 12:00PM"/>
            <Post username="Shibam Roy" timestamp="Today at 12:00PM"/>
            <Post username="Shibam Roy" timestamp="Today at 12:00PM"/>
            <Post username="Shibam Roy" timestamp="Today at 12:00PM"/>
           
        </ScrollView>
    );
}


const styles={

}