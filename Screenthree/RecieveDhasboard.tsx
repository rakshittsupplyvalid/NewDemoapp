import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Navbar from '../App/Navbar';
import api from '../service/api/apiInterceptors';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../types/Type';
import Footer from '../App/Footer';
import TruckCard from './TruckCard';

const RecieveDhasboard = () => {
  const [dispatchCount, setDispatchCount] = useState<number | null>(null);
  const [recieveCount, setRecieveCount] = useState<number | null>(null);
  const[RequestRempending,setRequestRempending]=useState<number | null>(null);
  const[PaymentPaid,setPaymentPaid]=useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();

  const fetchCounts = async () => {
    setLoading(true);
    try {
      const dispatchResponse = await api.get('/api/dispatch/truckcount/total?DispatchStatus=DISPATCHED');
      setDispatchCount(dispatchResponse.data);
     

      const recieveResponse = await api.get('/api/dispatch/truckcount/total?DispatchStatus=RECEIVED');
      setRecieveCount(recieveResponse.data);
     


      const RequestRempending = await api.get('/api/reimbursment/count?ApprovalStatus=PENDING');
      setRequestRempending(RequestRempending.data);
      console.log('Recixvgxeve',RequestRempending.data);

       
      const PaymentPaid = await api.get('/api/reimbursment/count?BillPaymentStatus=PAID&ApprovalStatus=APPROVED');
      setPaymentPaid(PaymentPaid.data);






      

      setError(null);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCounts();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <Navbar />
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={styles.cardContainer}>
          <View  style={{ width: '50%', padding: 3 }}>
            <TruckCard
              title="Receiving Pending Truck"
              count={dispatchCount}
              loading={loading}
              error={error}
              iconName="local-shipping"
              onPress={() => navigation.navigate("Dispatch Truck List")}

            />
            </View>
            <View  style={{ width: '50%', padding: 3 }}>
            <TruckCard
              title="Received Truck"
              count={recieveCount}
              loading={loading}
              error={error}
              iconName="directions-bus"
              onPress={() => navigation.navigate("Receive Truck List")}
            />
            </View>

            <View  style={{ width: '50%', padding: 3 }}>
             <TruckCard
              title="Request Reimburesment Pending"
              count={RequestRempending}
              loading={loading}
              error={error}
              iconName="hourglass-empty"
              onPress={() => navigation.navigate("ReimbursementList", { 
                ApprovalStatus: "PENDING" 
              })}
            />
                </View>


                <View  style={{ width: '50%', padding: 3 }}>
             <TruckCard
              title="Payment Paid"
              count={PaymentPaid}
              loading={loading}
              error={error}
              iconName="done"
            
              onPress={() => navigation.navigate("ReimbursementList", { 
                BillPaymentStatus: "PAID", 
                ApprovalStatus: "APPROVED"
              })}
            />
                </View>


                <View  style={{ width: '50%', padding: 3 }}>  
                 <TruckCard
                  title="Payment decline"
              count={PaymentPaid}
              loading={loading}
              error={error}
              iconName="cancel"
            
              onPress={() => navigation.navigate("ReimbursementList", { 
                BillPaymentStatus: "DECLINE", 
                ApprovalStatus: "APPROVED"
                  })}
                  />
            </View>
          </View>
        </ScrollView>
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
    flexWrap: 'wrap', // Allows wrapping to next row
    justifyContent: 'space-between', // Space between items
   
    paddingHorizontal: 10,
  },
  
});

export default RecieveDhasboard;
