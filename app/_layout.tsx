import {createNativeStackNavigator} from "@react-navigation/native-stack";
import LoginScreen from "./login/index";
import HomeScreen from "./screens/Home";
const AppStack=createNativeStackNavigator();

export default function RootLayout() {
  return (
      <AppStack.Navigator initialRouteName="Login">
        <AppStack.Screen name="Home" component={HomeScreen} options={{headerShown:false}}/>
        <AppStack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/>
      </AppStack.Navigator>
    );
}
