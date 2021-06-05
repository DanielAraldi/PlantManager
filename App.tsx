import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import AppLoading from "expo-app-loading";
import * as Notifications from "expo-notifications";

import Routes from "./src/routes";

import { PlantProps } from "./src/libs/storage";

import {
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold,
} from "@expo-google-fonts/jost";

export default function App() {
  const [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold,
  });

  useEffect(() => {
    const permissionsNotifications = () =>
      Notifications.requestPermissionsAsync();
    permissionsNotifications();
  });

  useEffect(() => {
    const subscriptions = Notifications.addNotificationResponseReceivedListener(
      async (notification) => {
        const data = notification.notification.request.content.data
          .plant as PlantProps;
        console.log(data);
      }
    );

    return () => subscriptions.remove();
  }, []);

  if (!fontsLoaded) return <AppLoading />;

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Routes />
    </>
  );
}
