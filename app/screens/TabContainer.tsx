//components
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { StyleSheet } from "react-native";

//screens
import HomeScreen from "./Home";
import ProfileScreen from "./Profile";
import FriendsScreen from "./Friends";
import NewPostScreen from './NewLog';
import SearchScreen from './Search';

//types
import { AppTabParamList } from '../utils/types';

const Tab = createBottomTabNavigator<AppTabParamList>();

export default function TabsContainer() {
  return (
    <Tab.Navigator screenOptions={
      {
        tabBarStyle: {
          position: "absolute",
          borderColor: "#ffffff22",
          borderTopWidth: StyleSheet.hairlineWidth,
          backgroundColor: '#17171d',
          height: 100,
          elevation: 0,
        },
        tabBarActiveTintColor: "#ec3750",
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={
          {
            title: "Home",
            headerShown: false,
            tabBarIcon: (tabInfo) => {
              return (
                <MaterialDesignIcons name='home' style={tabInfo.focused ? styles.focusedIcon : styles.unfocusedIcon} color={tabInfo.focused ? "#ec3750" : "#ffffff"} size={20} />
              );
            }
          }
        } />
      <Tab.Screen
        name="Friends"
        component={FriendsScreen}
        options={
          {
            title: "Friends",
            headerShown: false,
            tabBarIcon: (tabInfo) => {
              return (
                <MaterialDesignIcons name='account-group' color={tabInfo.focused ? "#ec3750" : "#ffffff"} size={20} />
              );
            }
          }
        } />
      <Tab.Screen
        name="Log"
        component={NewPostScreen}
        options={
          {
            title: "Log",
            headerShown: false,
            tabBarIcon: (tabInfo) => {
              return (
                <MaterialDesignIcons name='plus-box-multiple' color={tabInfo.focused ? "#ec3750" : "#ffffff"} size={20} />
              );
            }
          }
        } />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={
          {
            title: "Search",
            headerShown: false,
            tabBarIcon: (tabInfo) => {
              return (
                <MaterialDesignIcons name='magnify' color={tabInfo.focused ? "#ec3750" : "#ffffff"} size={20} />
              );
            }
          }
        } />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={
          {
            title: "My Profile",
            headerShown: false,
            tabBarIcon: (tabInfo) => {
              return (
                <MaterialDesignIcons name='account-circle' color={tabInfo.focused ? "#ec3750" : "#ffffff"} size={20} />
              );
            }
          }
        } />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  focusedIcon: {
    shadowColor: "#ec3750",
    shadowOpacity: 0.8,
    shadowOffset: {
      width: 0,
      height: 0
    }
  },
  unfocusedIcon: {

  }
})