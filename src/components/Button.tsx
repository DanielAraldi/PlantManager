import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from "react-native";

import colors from '../styles/colors';

export function Button() {
  return (
    <TouchableOpacity style={styles.button} activeOpacity={0.75}>
        <Text style={styles.buttonText}>></Text>
      </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.green,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    marginBottom: 16,
    height: 56,
    width: 56,
  },

  buttonText: {
    color: colors.white,
    fontSize: 24,
  },
})