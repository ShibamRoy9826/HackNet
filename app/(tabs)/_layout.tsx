//components
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { StyleSheet } from "react-native";

import { useTheme } from '@contexts/themeContext';
import { Tabs } from 'expo-router';

export default function TabsContainer() {
  const { colors } = useTheme();
  const styles = StyleSheet.create({
    focusedIcon: {
      shadowColor: colors.primary,
      shadowOpacity: 0.8,
      shadowOffset: {
        width: 0,
        height: 0
      }
    },
    unfocusedIcon: {

    }
  })
  return (
    <Tabs screenOptions={
      {
        tabBarStyle: {
          position: "absolute",
          borderColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          backgroundColor: colors.background,
          height: 100,
          elevation: 0,
        },
        tabBarActiveTintColor: colors.primary
      }}>
      <Tabs.Screen
        name="home"
        options={
          {
            title: "Home",
            headerShown: false,
            tabBarIcon: (tabInfo) => {
              return (
                <MaterialDesignIcons name='home' style={tabInfo.focused ? styles.focusedIcon : styles.unfocusedIcon} color={tabInfo.focused ? colors.primary : colors.text} size={20} />
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
                <MaterialDesignIcons name='account-group' color={tabInfo.focused ? colors.primary : colors.text} size={20} />
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
                <MaterialDesignIcons name='plus-box-multiple' color={tabInfo.focused ? colors.primary : colors.text} size={20} />
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
                <MaterialDesignIcons name='magnify' color={tabInfo.focused ? colors.primary : colors.text} size={20} />
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
                <MaterialDesignIcons name='account-circle' color={tabInfo.focused ? colors.primary : colors.text} size={20} />
              );
            }
          }
        } />
    </Tabs>
  );
}
