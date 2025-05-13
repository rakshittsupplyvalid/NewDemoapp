import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, View, ScrollView, RefreshControl, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Navbar from '../../App/Navbar';
import api from '../service/api/apiInterceptors';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../types/Type';
import Footer from '../../App/Footer';
import TruckCard from './TruckCard';
import NetInfo from "@react-native-community/netinfo";
import {useTranslation} from 'react-i18next';

const RecieveDhasboard = () => {
  const [dispatchCount, setDispatchCount] = useState<number | null>(null);
  const [recieveCount, setRecieveCount] = useState<number | null>(null);
  const [RequestRempending, setRequestRempending] = useState<number | null>(null);
  const [PaymentPaid, setPaymentPaid] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
    const { t ,  i18n } = useTranslation();

  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        fetchCounts(); // Agar internet on hota hai toh data fetch hoga
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  
  const fetchCounts = async () => {
    setLoading(true);
    try {
      const [dispatchResponse, recieveResponse, requestRemPending, paymentPaid] = await Promise.all([
        api.get('/api/dispatch/truckcount/total?DispatchStatus=DISPATCHED'),
        api.get('/api/dispatch/truckcount/total?DispatchStatus=RECEIVED'),
        api.get('/api/reimbursment/count?ApprovalStatus=PENDING'),
        api.get('/api/reimbursment/count?BillPaymentStatus=PAID&ApprovalStatus=APPROVED')
      ]);
  
      setDispatchCount(dispatchResponse?.data ?? 0);
      setRecieveCount(recieveResponse?.data ?? 0);
      setRequestRempending(requestRemPending?.data ?? 0);
      setPaymentPaid(paymentPaid?.data ?? 0);
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch data');
      // Reset counts on error
      setDispatchCount(0);
      setRecieveCount(0);
      setRequestRempending(0);
      setPaymentPaid(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (isConnected) {
      fetchCounts();
    } else {
      setRefreshing(false);
    }
  }, [isConnected]);

  return (
    <View style={styles.mainContainer}>
      <Navbar />
      <SafeAreaView style={styles.container}>
        {isConnected ? (
          <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            <View style={styles.cardContainer}>
              <View style={styles.cardWrapper}>
                <TruckCard
                  title={t('receivingPendingTruck')}
                  count={dispatchCount}
                  loading={loading}
                  error={error}
                  iconName="local-shipping"
                  onPress={() => navigation.navigate("Dispatch Truck List")}
                />
              </View>
              <View style={styles.cardWrapper}>
                <TruckCard
                title={t('receivedTruck')}
                  count={recieveCount}
                  loading={loading}
                  error={error}
                  iconName="directions-bus"
                  onPress={() => navigation.navigate("Receive Truck List")}
                />
              </View>
              <View style={styles.cardWrapper}>
                <TruckCard
              title={t('requestReimbursement')}
                  count={RequestRempending}
                  loading={loading}
                  error={error}
                  iconName="hourglass-empty"
                  onPress={() => navigation.navigate("ReimbursementList", { ApprovalStatus: "PENDING" })}
                />
              </View>
              <View style={styles.cardWrapper}>
                <TruckCard
                        title={t('paidPayment')}
                  count={PaymentPaid}
                  loading={loading}
                  error={error}
                  iconName="done"
                  onPress={() => navigation.navigate("ReimbursementList", { BillPaymentStatus: "PAID", ApprovalStatus: "APPROVED" })}
                />
              </View>
              <View style={styles.cardWrapper}>
                <TruckCard
                  title={t('paymentDeclined')}
                  count={PaymentPaid}
                  loading={loading}
                  error={error}
                  iconName="cancel"
                  onPress={() => navigation.navigate("ReimbursementList", { BillPaymentStatus: "DECLINE", ApprovalStatus: "APPROVED" })}
                />
              </View>
            </View>
          </ScrollView>
        ) : (
          <View style={styles.noInternetContainer}>
            <Text style={styles.noInternetText}>No Internet Connection</Text>
          </View>
        )}
      </SafeAreaView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  scrollView: {
    flexGrow: 1,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cardWrapper: {
    width: '50%',
    
 
  },
  noInternetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noInternetText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
});

export default RecieveDhasboard;
