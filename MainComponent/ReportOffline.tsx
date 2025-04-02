import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

import { MMKV } from 'react-native-mmkv';

const ReportOffline = () => {
  const [offlineForms, setOfflineForms] = useState([]);

  const storage = new MMKV();

  useEffect(() => {
    // MMKV se data fetch karo
    const fetchOfflineData = () => {
      let existingData = storage.getString("offlineForms");
      let parsedData = existingData ? JSON.parse(existingData) : [];
      setOfflineForms(parsedData);
    };

    fetchOfflineData(); // Pehli baar data load karne ke liye

    // **Listener: Jab bhi storage update ho, data refresh ho**
    const interval = setInterval(fetchOfflineData, 2000); // Refresh every 2 sec

    return () => clearInterval(interval); // Cleanup
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Offline Saved Forms</Text>

      {offlineForms.length === 0 ? (
        <Text style={styles.emptyText}>No offline forms found.</Text>
      ) : (
        <FlatList
          data={offlineForms}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.text}>🚛 Truck Number: {item.truckNumber}</Text>
              <Text style={styles.text}>📅 Date: {item.date || "N/A"}</Text>
              <Text style={styles.text}>⚖️ Weight: {item.weight || "N/A"}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  text: {
    fontSize: 16,
  },
});

export default ReportOffline;
