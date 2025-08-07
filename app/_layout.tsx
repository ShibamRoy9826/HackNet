import {createNativeStackNavigator} from "@react-navigation/native-stack";
import LoginScreen from "./auth/login";
import SignUpScreen from "./auth/signup";
import TabsContainer from "./screens/TabContainer";
import NotificationScreen from "./screens/Notifications";
import ForgotPassScreen from "./auth/forgotPass";

const AppStack=createNativeStackNavigator();

export default function RootLayout() {
  return (
      <AppStack.Navigator initialRouteName="Login">
        <AppStack.Screen name="Notifications" component={NotificationScreen} options={{headerShown:false,animation:"slide_from_bottom"}}/>
        <AppStack.Screen name="Tabs" component={TabsContainer} options={{headerShown:false,animation:"slide_from_bottom"}}/>
        <AppStack.Screen name="ForgotPass" component={ForgotPassScreen} options={{headerShown:false,animation:"fade"}}/>
        <AppStack.Screen name="Login" component={LoginScreen} options={{headerShown:false,animation:"fade"}}/>
        <AppStack.Screen name="SignUp" component={SignUpScreen} options={{headerShown:false,animation:"fade"}}/>
      </AppStack.Navigator>
    );
}
