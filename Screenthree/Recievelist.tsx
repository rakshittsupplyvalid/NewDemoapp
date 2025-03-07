import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList, ActivityIndicator, View } from 'react-native';
import Navbar from '../App/Navbar';
import api from '../service/api/apiInterceptors';

const Recievelist = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthReports = async () => {
      try {
        const response = await api.get('/api/dispatch?DispatchStatus=RECEIVED'); 
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching health reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthReports();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              
              {/* Dispatch Branch Header */}
              <View style={styles.dispatchbranchContainer}>
                <Text style={styles.labelheading}>Dispatch Branch:</Text>
                <Text style={styles.valueheading}>{item.dispatchbranch}</Text>
              </View>

              {/* D a t a   C  a  r  d    */}
              <View style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.label}>District:</Text>
                  <Text style={styles.value}>{item.destinationdistrict}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Quantity:</Text>
                  <Text style={styles.value}>{item.quantitymt}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{new Date(item.dispatchdate).toLocaleDateString()}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Truck Number:</Text>
                  <Text style={styles.value}>{item.trucknumber}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Transporter:</Text>
                  <Text style={styles.value}>{item.transportername}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Dispatch Type:</Text>
                  <Text style={styles.value}>{item.dispatchtype}</Text>
                </View>
               
              </View>

            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cardContainer: {
    marginBottom: 10,
    padding: 20,
  },
  dispatchbranchContainer: {
    backgroundColor: '#FF9500',
    padding: 10,
    
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dispatchbranchText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    backgroundColor: '#FFF',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 15,
  },
  value: {
    color: "#555",
    fontSize: 15,
  },
  labelheading: {
    fontWeight: "bold",
    color: "white",
    fontSize: 17,
  },
  valueheading: {
    color: "white",
    fontSize: 17,
  },
});

export default Recievelist;
