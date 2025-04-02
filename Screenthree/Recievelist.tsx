import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList, ActivityIndicator, View } from 'react-native';
import Navbar from '../App/Navbar';
import api from '../service/api/apiInterceptors';
import moment from 'moment';

const PAGE_SIZE = 2; // Define the number of items per page

const Recievelist = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchHealthReports = async () => {
      try {
        const response = await api.get(`/api/dispatch?DispatchStatus=RECEIVED&PageNumber=${page}&PageSize=${PAGE_SIZE}`); 
        if (response.data.length < PAGE_SIZE) {
          setHasMore(false);
        }
        setReports(prevReports => [...prevReports, ...response.data]);
        console.log("received", response.data);
      } catch (error) {
        console.error('Error fetching health reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthReports();
  }, [page]);

  const loadMoreReports = () => {
    if (hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />

      {loading && reports.length === 0 ? (
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

              {/* Data Card */}
              <View style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.label}>District:</Text>
                  <Text style={styles.transportervalue}>{item.destinationdistrict}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Quantity:</Text>
                  <Text style={styles.value}>{item.quantitymt}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Date:</Text>
                  <Text style={styles.value}>{moment(item.dispatchdate).format('DD-MM-YYYY')}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Truck Number:</Text>
                  <Text style={styles.value}>{item.trucknumber}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Transporter:</Text>
                  <Text style={styles.transportervalue}>{item.transportername}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Dispatch Type:</Text>
                  <Text style={styles.value}>{item.dispatchtype}</Text>
                </View>
              </View>
            </View>
          )}
          onEndReached={loadMoreReports}
          onEndReachedThreshold={0.5}
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
    backgroundColor: '#fff',
    padding: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 15,
    width: 120,
  },
  transportervalue: {
    color: "#555",
    fontSize: 15,
    width: 120,
    textAlign: 'right',
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
