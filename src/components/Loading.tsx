import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

import loadAnimation from "../assets/load.json";
import serverErrorAnimation from "../assets/server-error.json";

interface LoadingProps {
  load: boolean;
  serverError?: boolean;
}

export function Loading({ load, serverError }: LoadingProps) {
  return (
    <View style={styles.container}>
      {load && (
        <LottieView
          source={loadAnimation}
          autoPlay
          loop
          style={styles.animation}
        />
      )}
      {serverError && (
        <LottieView
          source={serverErrorAnimation}
          autoPlay
          loop
          style={styles.animation}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  animation: {
    backgroundColor: "transparent",
    width: 200,
    height: 200,
  },
});
