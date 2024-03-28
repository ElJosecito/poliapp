import React from "react";
import { StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//screens
import Prueba from "../../screens/Prueba";
import UserScreen from "../../screens/UserScreen";
//icons
import FontAwesome from "@expo/vector-icons/FontAwesome";

const Tab = createBottomTabNavigator();

const BottomNav = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
      }}
    >
      {/* icono para navegacion con el componente de prueba */}
      <Tab.Screen
        name="Home"
        component={Prueba}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
            >
              <FontAwesome
                name="home"
                size={focused ? 28 : 24}
                color={focused ? "white" : "grey"}
              />
            </View>
          ),
        }}
      />
        
        {/* icono para navegacion con el componente de UserScreen */}
      <Tab.Screen
        name="User"
        component={UserScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
            >
              <FontAwesome
                name="user"
                size={focused ? 28 : 24}
                color={focused ? "white" : "grey"}
              />
            </View>
          ),
        }}
      />
      
    </Tab.Navigator>
  );
};

export default BottomNav;

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 80,
    position: "absolute",
    backgroundColor: "#00582F",
  },
});
