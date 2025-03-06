import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, RefreshControl, TouchableOpacity , SafeAreaView , Modal } from 'react-native';
import api from '../service/api/apiInterceptors';
import { useRoute, RouteProp } from '@react-navigation/native';
import { tableStyles } from '../theme/TableStyles';
import Navbar from '../App/Navbar';

import { formatDate } from '../utils/dateUtils';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native-gesture-handler';


interface TableData {
  id: string;
  username: string;
  date: string;
  billtype: string;
  amount: string | number;
  approvalstatus: string;
  purpose: string;
}

const ReimbursementList: React.FC = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TableData | null>(null);
  type RouteParams = {
    ApprovalStatus: string;
    BillPaymentStatus: string;
  };

  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const { ApprovalStatus, BillPaymentStatus } = route.params || {};
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [BillPaymentStatus, ApprovalStatus]);

  const fetchData = async () => {
    try {
      let url = "/api/reimbursment?";

      if (BillPaymentStatus) {
        url += `BillPaymentStatus=${BillPaymentStatus}&`;
      }
      if (ApprovalStatus) {
        url += `ApprovalStatus=${ApprovalStatus}`;
      }

      const response = await api.get(url);

      let data = response.data.map((x: any) => ({
        ...x,
        date: formatDate(x.date),
        amount: x.amount ? x.amount : 'N/A',
        purpose: x.purpose ? x.purpose : 'No purpose available',
      }));

    
      setTableData(data);

    } catch (error) {
      console.error("Error fetching reimbursement data:", error);
    }
  };



  const filteredData = tableData
    .filter((item) => {
      const searchTerm = searchQuery.toUpperCase();
      const itemDate = item.date.toUpperCase();
      const formattedSearchQuery = searchQuery.split('/').reverse().join('');

      return (
        item.username.toUpperCase().includes(searchTerm) ||
        itemDate.includes(formattedSearchQuery) ||
        item.billtype.toUpperCase().includes(searchTerm) ||
        item.approvalstatus.toUpperCase().includes(searchTerm) ||
        (item.amount && item.amount.toString().includes(searchTerm))
      );
    })
    .sort((a, b) => {

      const dateA = a.date.split('/').reverse().join('-'); // Convert to YYYY-MM-DD
      const dateB = b.date.split('/').reverse().join('-'); 

      return new Date(dateA).getTime() - new Date(dateB).getTime(); // Ascending order
    });

  // const handleClick = (itemId: string) => {
  //   navigateToScreen('ReimbView', { id: itemId });
  // };

  // const handleAddClick = () => {
  //   navigateToScreen('/ReimbForm');
  // };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderItem = ({ item, index }: { item: TableData; index: number }) => (
    <View
      style={[
        tableStyles.row,
        { backgroundColor: index % 2 === 0 ? '#e6e7e8' : '#fff' },
      ]}
    >
      <Text style={tableStyles.cell}>{item.date}</Text>
      <Text style={tableStyles.cell}>{item.billtype.toUpperCase()}</Text>
      <Text style={tableStyles.cell}>{item.amount}</Text>
      <TouchableOpacity  onPress={() => {
          setSelectedItem(item);
          setModalVisible(true);
        }}>
        <MaterialIcons
          name="visibility"
          size={25}
          color="black"
          style={{ position: 'relative', right: 20 }}
        />
      </TouchableOpacity>
    </View>
  );



  return (
  

   <SafeAreaView> 
    <Navbar />
    <ScrollView>
    <View style={tableStyles.container}>
      
      <TextInput
        style={tableStyles.searchInput}
        placeholder={`Search by ${filteredData.length} Item`}
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <View style={tableStyles.header}>
        <Text style={tableStyles.headerCell}>Date</Text>
        <Text style={tableStyles.headerCell}>Bill Type</Text>
        <Text style={tableStyles.headerCell}>Amount</Text>
        <Text style={tableStyles.headerCell}>View</Text>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={tableStyles.modalContainer}>
          <View style={tableStyles.modalContent}>
            <Text style={tableStyles.modalTitle}>Bill Details</Text>
            {selectedItem && (
              <>
                <Text  style={tableStyles.headerCell}>Date {selectedItem.date}</Text>
                <Text>Bill Type {selectedItem.billtype.toUpperCase()}</Text>
                <Text>Amount {selectedItem.amount}</Text>
                <Text>Purpose {selectedItem.purpose}</Text>
                <Text>Total amount {selectedItem.amount}</Text>
              </>
            )}
            <TouchableOpacity
              style={tableStyles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: 'white' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

     
    </View>
    </ScrollView>

    <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={tableStyles.emptyText}>No data available</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      />
    </SafeAreaView>
  );
};

export default ReimbursementList;
