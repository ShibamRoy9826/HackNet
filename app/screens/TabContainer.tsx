import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "./Home";
import MyAccount from "./MyAccount";
import FriendsScreen from "./Friends";
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {BlurView} from "expo-blur";
import {StyleSheet} from "react-native";
import NewPostScreen from './NewPost';
import SearchScreen from './Search';

const Tab = createBottomTabNavigator();

export default function TabsContainer() {
  return (
    <Tab.Navigator screenOptions={
      {
        tabBarStyle:{
          position:"absolute",
          borderColor:"#ffffff22",
          borderTopWidth: StyleSheet.hairlineWidth,
          backgroundColor: 'transparent',
          height: 100,
          elevation: 0,
        },
        tabBarBackground:()=>(
           <BlurView tint="dark" experimentalBlurMethod="dimezisBlurView" intensity={10} style={StyleSheet.absoluteFill} />
        ),
      }}>
      <Tab.Screen
       name="Home"
       component={HomeScreen}
       options={
        {
          title:"Home",
          headerShown:false,
          tabBarIcon:(tabInfo)=>{
            return(
              <MaterialDesignIcons name='home' color={tabInfo.focused?"#338eda":"#ffffff"} size={20}/>
            );
          }
          }
          }/>
      <Tab.Screen
       name="Friends"
       component={FriendsScreen}
       options={
        {
          title:"Friends",
          headerShown:false,
          tabBarIcon:(tabInfo)=>{
            return(
              <MaterialDesignIcons name='account-group' color={tabInfo.focused?"#338eda":"#ffffff"} size={20}/>
            );
          }
          }
          }/>
      <Tab.Screen
       name="Log"
       component={NewPostScreen}
       options={
        {
          title:"Log",
          headerShown:false,
          tabBarIcon:(tabInfo)=>{
            return(
              <MaterialDesignIcons name='plus-box-multiple' color={tabInfo.focused?"#338eda":"#ffffff"} size={20}/>
            );
          }
          }
          }/>
      <Tab.Screen
       name="Search"
       component={SearchScreen}
       options={
        {
          title:"Search",
          headerShown:false,
          tabBarIcon:(tabInfo)=>{
            return(
              <MaterialDesignIcons name='magnify' color={tabInfo.focused?"#338eda":"#ffffff"} size={20}/>
            );
          }
          }
          }/>
      <Tab.Screen
        name="MyAccount"
        component={MyAccount}
        options={
          {
            title:"My Account",
            headerShown:false,
            tabBarIcon:(tabInfo)=>{
              return(
                <MaterialDesignIcons name='account-circle' color={tabInfo.focused?"#338eda":"#ffffff"} size={20}/>
              );
            }
          }
          }/>
    </Tab.Navigator>
  );
}