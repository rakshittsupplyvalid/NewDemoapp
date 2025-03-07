import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, RefreshControl, TouchableOpacity , SafeAreaView , Modal, Image } from 'react-native';
import api from '../service/api/apiInterceptors';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { tableStyles } from '../theme/TableStyles';
import Navbar from '../App/Navbar';
import { StackNavigationProp } from '@react-navigation/stack';
import { formatDate } from '../utils/dateUtils';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { HealthreportStyle } from '../theme/HealthreportStyle';



interface TableData {
  [x: string]: any;
  id: string;
  username: string;
  date: string;
  billtype: string;
  amount: string | number;
  approvalstatus: string;
  purpose: string;
}

interface Reimbursementprops {
  navigation: StackNavigationProp<any>;
}

const ReimbursementList: React.FC<Reimbursementprops> = ({navigation}) => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReimbursement, setSelectedReimbursement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  const fetchReimbursementDetails = async (id: string) => {
    try {
      const response = await api.get(`/api/reimbursment/${id}`);
      setSelectedReimbursement(response.data);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching reimbursement details:", error);
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
        { backgroundColor: index % 2 === 0 ? '#f2f0ed' : '#fff' },
      ]}

    >
  
  
      <Text style={tableStyles.cell}>{item.date}</Text>
      <Text style={tableStyles.cell}>{item.billtype.toUpperCase()}</Text>
      <Text style={tableStyles.cell}>{item.amount}</Text>
      <TouchableOpacity onPress={() => fetchReimbursementDetails(item.id)} >
         
            <MaterialIcons name="visibility" size={25} color="black" />
          </TouchableOpacity>



       
    </View>
  );



  return (
  

   <SafeAreaView> 
    <Navbar />
  
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
        <View style={HealthreportStyle.modalContainer}>

           <View style={HealthreportStyle.heading}>
                      <Text style={HealthreportStyle.text} >Reimbursment List</Text>
                    </View>
          <View style={HealthreportStyle.modalContent}>
 
            {selectedReimbursement&& (
              <>
 <View style={HealthreportStyle.rowone}>
                  <Text style={HealthreportStyle.labelone}>Date</Text>
                  <Text style={HealthreportStyle.valueone}>{selectedReimbursement.date}</Text>
                </View>


                <View style={HealthreportStyle.rowone}>
                  <Text style={HealthreportStyle.labelone}>Bill Type</Text>
                  <Text style={HealthreportStyle.valueone}>{selectedReimbursement.billtype.toUpperCase()}</Text>
                </View>


                <View style={HealthreportStyle.rowone}>
                  <Text style={HealthreportStyle.labelone}>Bill Type</Text>
                  <Text style={HealthreportStyle.valueone}>{selectedReimbursement.billtype.toUpperCase()}</Text>
                </View>


                <View style={HealthreportStyle.rowone}>
                  <Text style={HealthreportStyle.labelone}>Amount:</Text>
                  <Text style={HealthreportStyle.valueone}>₹{selectedReimbursement.amount}</Text>
                </View>



                <View style={HealthreportStyle.rowone}>
                  <Text style={HealthreportStyle.labelone}>Purpose:</Text>
                  <Text style={HealthreportStyle.valueone}>₹{selectedReimbursement.purpose}</Text>
                </View>
                
                

                

      
      

      {selectedReimbursement.images && selectedReimbursement.images.length > 0 && (
          <Image 
            source={{ uri: `https://dev-backend-2024.epravaha.com${selectedReimbursement.images[0]}` }}
            style={tableStyles.image}
          />
        )}
      

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

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={tableStyles.emptyText}>No data available</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      />
    </View>
  
    </SafeAreaView>
  );
};

export default ReimbursementList;
