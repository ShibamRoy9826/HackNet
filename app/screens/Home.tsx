import { View ,Text} from "react-native";
import { Button } from "@react-navigation/elements";

export default function HomeScreen({navigation}){
    return (
        <View>
            <Text>
                Welcome back to home:)
            </Text> 

            <Button onPressIn={()=>{navigation.navigate("Login")}}>
                Wanna login again?
            </Button>
           
        </View>
    );
}