// navigation
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//screens
import LoginScreen from "./auth/login";
import SignUpScreen from "./auth/signup";
import NotificationScreen from "./screens/Notifications";
import ForgotPassScreen from "./auth/forgotPass";
import LoadingScreen from "./screens/Loading";
import EditProfileScreen from "./screens/EditProfile";
import SettingsScreen from "./screens/Settings";
import CommentsScreen from "./screens/CommentSection";

// firebase stuff
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from './auth/firebase';

//components
import TabsContainer from "./screens/TabContainer";

//react and expo
import { useEffect, useState } from 'react';

//contexts
import { UserDataProvider } from "./contexts/userContext";
import { ModalProvider } from "./contexts/modalContext";

//types
import { AppStackParamList } from "./utils/types";

//Splash screen
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

const AppStack = createNativeStackNavigator<AppStackParamList>();

export default function RootLayout() {

  // handling loading state
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [])

  if (loading) {
    return (
      <LoadingScreen />
    )
  } else {
    SplashScreen.hide();
  }

  return (
    <ModalProvider>
      <UserDataProvider>
        <AppStack.Navigator initialRouteName={user ? "Tabs" : "Login"}>
          <AppStack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerTitle: "Edit Profile", headerShown: true, animation: "none", headerStyle: { backgroundColor: "#17171d" }, headerTintColor: "white" }} />
          <AppStack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true, animation: "none", headerStyle: { backgroundColor: "#17171d" }, headerTintColor: "white" }} />
          <AppStack.Screen name="Notifications" component={NotificationScreen} options={{ headerShown: true, animation: "none", headerStyle: { backgroundColor: "#17171d" }, headerTintColor: "white" }} />
          <AppStack.Screen name="Comments" component={CommentsScreen} options={{ headerShown: true, animation: "none", headerStyle: { backgroundColor: "#17171d" }, headerTintColor: "white" }} />
          <AppStack.Screen name="Tabs" component={TabsContainer} options={{ headerShown: false, animation: "slide_from_bottom" }} />
          <AppStack.Screen name="ForgotPass" component={ForgotPassScreen} options={{ headerShown: false, animation: "fade" }} />
          <AppStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, animation: "fade" }} />
          <AppStack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false, animation: "fade" }} />
        </AppStack.Navigator>
      </UserDataProvider>
    </ModalProvider>
  );
}
