import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from "react-native";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Interactive Counter</Text>
        <Text style={styles.subtitle}>React Native Lab 5</Text>

        <View style={styles.display}>
          <Text style={styles.count}>{count}</Text>
        </View>

        <View style={styles.row}>
          <Pressable
            style={styles.button}
            onPress={() => setCount(count + 1)}
          >
            <Text style={styles.buttonText}>Increment</Text>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={() => setCount(count - 1)}
          >
            <Text style={styles.buttonText}>Decrement</Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.resetButton}
          onPress={() => setCount(0)}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    alignItems: "center",
    elevation: 5,
  },
  heading: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#153A70",
  },
  subtitle: {
    marginTop: 8,
    color: "#65758B",
  },
  display: {
    marginVertical: 24,
    padding: 20,
    width: "100%",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    alignItems: "center",
  },
  count: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#153A70",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 10,
  },
  resetButton: {
    backgroundColor: "#475569",
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});