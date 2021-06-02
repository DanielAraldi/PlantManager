import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";

import { PlantSelect } from "../pages/PlantSelect";
import { MyPlants } from "../pages/MyPlants";

import colors from "../styles/colors";

const AppTab = createBottomTabNavigator();

const AuthRoutes = () => {
  return (
    <AppTab.Navigator
      tabBarOptions={{
        activeTintColor: colors.green, // When is active
        inactiveTintColor: colors.heading, // When isn't active
        labelPosition: "beside-icon", // Position side by side
        style: { paddingVertical: 20, height: 88 },
      }}
    >
      <AppTab.Screen
        name="New Plant"
        component={PlantSelect}
        options={{
          /* 
          parameters dynamically picked up by 
          the series of options in the table above 
          */
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons
              name="add-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <AppTab.Screen
        name="My Plant"
        component={MyPlants}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons
              name="format-list-bulleted"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </AppTab.Navigator>
  );
};

export default AuthRoutes;
