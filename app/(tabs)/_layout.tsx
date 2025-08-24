//components
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { StyleSheet } from "react-native";

import { Tabs } from 'expo-router';

export default function TabsContainer() {
  return (
    <Tabs screenOptions={
      {
        tabBarStyle: {
          position: "absolute",
          borderColor: "#ffffff22",
          borderTopWidth: StyleSheet.hairlineWidth,
          backgroundColor: '#17171d',
          height: 100,
          elevation: 0,
        },
        tabBarActiveTintColor: "#ec3750"
      }}>
      <Tabs.Screen
        name="home"
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
      <Tabs.Screen
        name="friends"
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
      <Tabs.Screen
        name="newLog"
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
      <Tabs.Screen
        name="search"
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
      <Tabs.Screen
        name="profile"
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
    </Tabs>
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