import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList, ActivityIndicator, View } from 'react-native';
import Navbar from '../App/Navbar';
import api from '../service/api/apiInterceptors';

const DispatchReportlist = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const pageSize = 10;

  const fetchHealthReports = async () => {
    if (!hasMoreData || loading) return;
    setLoading(true);

    try {
      const response = await api.get(
        `/api/healthreport?ReportType=DISPATCH&PageNumber=${pageNumber}&PageSize=${pageSize}`
      );

      const newReports = response.data || [];

      setReports((prevReports) => (pageNumber === 1 ? newReports : [...prevReports, ...newReports]));

      if (newReports.length < pageSize) {
        setHasMoreData(false);
      }
    } catch (error) {
      console.error('Error fetching health reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthReports();
  }, [pageNumber]); // Dependency me pageNumber add kiya

  const handleLoadMore = () => {
    if (!loading && hasMoreData) {
      setPageNumber((prevPage) => prevPage + 1);
    }
  };

  return (
    <SafeAreaView>
      <Navbar />

      <FlatList
        data={reports}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.one}>
            <View style={styles.card}>
              <View style={styles.topRightCorner} />
              <View style={styles.bottomLeftCorner} />
              <View style={styles.row}>
                <Text style={styles.label}>Assayer Name:</Text>
                <Text style={styles.value}>{item.assayername}</Text>
              </View>
              <View style={styles.row}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{new Date(item.date).toLocaleDateString()}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Truck Number</Text>
                <Text style={styles.value}>{item.trucknumber}</Text>
              </View>
            </View>
          </View>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" color="blue" /> : null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  one: { paddingHorizontal: 30 },
  card: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
    marginVertical: 10,
    height: 175,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  label: { fontWeight: 'bold', color: '#333', flex: 0.5, fontSize: 15 },
  value: { color: '#555', flex: 0.5, flexWrap: 'wrap' },
  topRightCorner: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 25,
    height: 25,
    backgroundColor: '#F79B00',
    borderTopRightRadius: 10,
  },
  bottomLeftCorner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 25,
    height: 25,
    backgroundColor: '#F79B00',
    borderBottomLeftRadius: 10,
  },
});

export default DispatchReportlist;
