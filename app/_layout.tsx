import {createNativeStackNavigator} from "@react-navigation/native-stack";
import LoginScreen from "./auth/login";
import SignUpScreen from "./auth/signup";
import TabsContainer from "./screens/TabContainer";
import NotificationScreen from "./screens/Notifications";
import ForgotPassScreen from "./auth/forgotPass";
import {auth} from './auth/firebase';
import {useEffect,useState} from 'react';
import { onAuthStateChanged, User } from "firebase/auth";
import LoadingScreen from "./screens/Loading";
import EditProfileScreen from "./screens/EditProfile";
import SettingsScreen from "./screens/Settings";
import { UserDataProvider } from "./contexts/userContext";


const AppStack=createNativeStackNavigator();

export default function RootLayout() {
  const [user,setUser]=useState<User|null>(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    const unsubscribe=onAuthStateChanged(auth,(currentUser)=>{
      setUser(currentUser);
      setLoading(false);
    });

    return ()=> unsubscribe();

  },[])

  if(loading){
    return(
      <LoadingScreen/>
    )
  }
  return (
    <UserDataProvider>
      <AppStack.Navigator initialRouteName={user?"Tabs":"Login"}>
        <AppStack.Screen name="EditProfile" component={EditProfileScreen} options={{headerTitle:"Edit Profile",headerShown:true,animation:"none",headerStyle:{backgroundColor:"#17171d"},headerTintColor:"white"}}/>
        <AppStack.Screen name="Settings" component={SettingsScreen} options={{headerShown:true,animation:"none",headerStyle:{backgroundColor:"#17171d"},headerTintColor:"white"}}/>
        <AppStack.Screen name="Notifications" component={NotificationScreen} options={{headerShown:true,animation:"none",headerStyle:{backgroundColor:"#17171d"},headerTintColor:"white"}}/>
        <AppStack.Screen name="Tabs" component={TabsContainer} options={{headerShown:false,animation:"slide_from_bottom"}}/>
        <AppStack.Screen name="ForgotPass" component={ForgotPassScreen} options={{headerShown:false,animation:"fade"}}/>
        <AppStack.Screen name="Login" component={LoginScreen} options={{headerShown:false,animation:"fade"}}/>
        <AppStack.Screen name="SignUp" component={SignUpScreen} options={{headerShown:false,animation:"fade"}}/>
      </AppStack.Navigator>
  </UserDataProvider>
    );
}
