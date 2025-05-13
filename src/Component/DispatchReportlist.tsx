import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList, ActivityIndicator, View, TextInput } from 'react-native';
import Navbar from '../../App/Navbar';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';

const DispatchReportList = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();

  // Generate 3 dummy reports
  const generateDummyReports = () => {
    return [
      {
        id: '1',
        assayername: 'Assayer 1',
        trucknumber: 'TRUCK1234',
        date: new Date().toISOString(),
        approvalstatus: 'Approved',
        datastring: JSON.stringify({
          GrossWeight: '2500 kg',
          NetWeight: '2000 kg',
          TareWeight: '500 kg'
        })
      },
      {
        id: '2',
        assayername: 'Assayer 2',
        trucknumber: 'TRUCK5678',
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        approvalstatus: 'Pending',
        datastring: JSON.stringify({
          GrossWeight: '3000 kg',
          NetWeight: '2400 kg',
          TareWeight: '600 kg'
        })
      },
      {
        id: '3',
        assayername: 'Assayer 3',
        trucknumber: 'TRUCK9012',
        date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        approvalstatus: 'Rejected',
        datastring: JSON.stringify({
          GrossWeight: '2800 kg',
          NetWeight: '2200 kg',
          TareWeight: '600 kg'
        })
      }
    ];
  };

  useFocusEffect(
    useCallback(() => {
      setSearchQuery('');
      // Load dummy data when screen comes into focus
      setLoading(true);
      const dummyData = generateDummyReports();
      setReports(dummyData);
      setFilteredReports(dummyData);
      setLoading(false);
    }, [])
  );

  const filterReports = (data, query) => {
    if (!query) return data;
    const lowerQuery = query.toLowerCase();
    return data.filter(item => {
      const formattedDate = moment(item.date).add(5, "hours").format("DD-MM-YYYY");
      return (
        item.trucknumber?.toLowerCase().includes(lowerQuery) ||
        item.assayername?.toLowerCase().includes(lowerQuery) ||
        formattedDate.includes(lowerQuery)
      );
    });
  };

  useEffect(() => {
    setFilteredReports(filterReports(reports, searchQuery));
  }, [searchQuery, reports]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Navbar />
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search Truck, Assayer or Date"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>

      <FlatList
        data={filteredReports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.one}>
            <View style={styles.card}>
              <View style={styles.topRightCorner} />
              <View style={styles.bottomLeftCorner} />
              <View style={styles.row}>
                <Text style={styles.label}>{t('assyarerName')}</Text>
                <Text style={styles.value}>{item.assayername}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t('Date')}</Text>
                <Text style={styles.value}>{moment(item.date).format('DD-MM-YYYY')}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t('TruckNumber')}</Text>
                <Text style={styles.value}>{item.trucknumber}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Status</Text>
                <Text style={[
                  styles.value,
                  item.approvalstatus === 'Approved' && { color: 'green' },
                  item.approvalstatus === 'Rejected' && { color: 'red' }
                ]}>
                  {item.approvalstatus}
                </Text>
              </View>
            </View>
          </View>
        )}
        ListFooterComponent={loading ? <ActivityIndicator size="large" color="blue" /> : null}
        ListEmptyComponent={!loading && <Text style={{ textAlign: 'center', marginTop: 20 }}>No Data Found</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  one: { paddingHorizontal: 30, backgroundColor: 'white' },
  card: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
    marginVertical: 10,
    height: 200,
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  label: { 
    fontWeight: 'bold', 
    color: '#333', 
    flex: 0.5, 
    fontSize: 15 
  },
  value: { 
    color: '#555', 
    flex: 0.5, 
    flexWrap: 'wrap',
    textAlign: 'right'
  },
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default DispatchReportList;