import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList, ActivityIndicator, View } from 'react-native';
import Navbar from '../App/Navbar';
import api from '../service/api/apiInterceptors';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/Type';
import moment from 'moment';

type DispatchRecieve = StackNavigationProp<RootStackParamList, 'DispatchRecieve'>;

const PAGE_SIZE = 2; // Define the number of items per page

const Dispatchlist = () => {
  const navigation = useNavigation<DispatchRecieve>();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchHealthReports = async (pageNumber: number) => {
    if (!hasMore) return;
    try {
      const response = await api.get(`/api/dispatch?DispatchStatus=DISPATCHED&PageNumber=${pageNumber}&PageSize=${PAGE_SIZE}`);
      if (response.data.length > 0) {
        setReports(prevReports => [...prevReports, ...response.data]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching health reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthReports(page);
  }, [page]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />

      <FlatList
        data={reports}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <View style={styles.dispatchbranchContainer}>
              <View style={styles.row}>
                <Text style={styles.labelheading}>Dispatch Branch:</Text>
                <Text style={styles.valueheading}>{item.dispatchbranch}</Text>
              </View>
            </View>

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
                <Text style={styles.value}>{moment(item.dispatchdate).format('DD-MM-YYYY')}</Text>
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
        ListFooterComponent={loading && hasMore ? <ActivityIndicator size="large" color="blue" /> : null}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
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
    borderBottomWidth: 5,
    borderBottomColor: '#f6a001',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 15,
    elevation: 3,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 15
  },
  value: {
    color: "#555",
    fontSize: 15
  },
  labelheading: {
    fontWeight: "bold",
    color: "white",
    fontSize: 17
  },
  valueheading: {
    color: "white",
    fontSize: 17
  },
});

export default Dispatchlist;
