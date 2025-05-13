import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ActivityIndicator,
 
} from 'react-native';
import api from '../service/api/apiInterceptors';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { tableStyles } from '../theme/TableStyles';
import Navbar from '../../App/Navbar';
import { StackNavigationProp } from '@react-navigation/stack';
import { formatDate } from '../utils/dateUtils';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { HealthreportStyle } from '../theme/HealthreportStyle';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../types/Type';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImageViewing from 'react-native-image-viewing';


interface TableData {
  id: string;
  username?: string;
  date?: string;
  billtype?: string;
  amount?: string | number;
  approvalstatus?: string;
  purpose?: string;
  images?: string[];
  approvalStatus?: string;
  startTripReading?: string;
  endTripReading?: string;



}

interface Reimbursementprops {
  navigation: StackNavigationProp<any>;
}

const ReimbursementList: React.FC = () => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReimbursement, setSelectedReimbursement] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
   const [showImages, setShowImages] = useState(false);

  const { t } = useTranslation();
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();
  const [refreshing, setRefreshing] = useState(false);



  type RouteParams = {
    ApprovalStatus?: string;
    BillPaymentStatus?: string;
  };

  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const { ApprovalStatus, BillPaymentStatus } = route.params || {};

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = "/api/Reimbursment?";

      if (BillPaymentStatus) {
        url += `BillPaymentStatus=${BillPaymentStatus}&`;
      }
      if (ApprovalStatus) {
        url += `ApprovalStatus=${ApprovalStatus}`;
      }

      const response = await api.get(url);

      const data = response.data.map((x: any) => ({
        id: x.id || '',
        username: x.username || 'Unknown',
        date: x.date ? formatDate(x.date) : 'N/A',
        billtype: x.billType || 'Unknown',
        amount: x.amount ? x.amount : 'N/A',
        approvalstatus: x.approvalstatus || 'Unknown',
        purpose: x.purpose || 'No purpose available',
        images: x.images || []
      }));

      setTableData(data);
    } catch (error) {
      console.error("Error fetching reimbursement data:", error);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [ApprovalStatus, BillPaymentStatus]);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [ApprovalStatus, BillPaymentStatus])
  );

  const fetchReimbursementDetails = async (id: string) => {
    try {
      const response = await api.get(`/api/Reimbursment/${id}`);
      setSelectedReimbursement({
        ...response.data,
        date: response.data.date ? formatDate(response.data.date) : 'N/A',
        billtype: response.data.billType || 'Unknown',
        amount: response.data.amount ? response.data.amount : 'N/A',
        purpose: response.data.purpose || 'No purpose available',
        approvalStatus: response.data.approvalStatus,
        startTripReading: response.data.startTripReading,
        endTripReading: response.data.startTripReading

      });
      setModalVisible(true);
      setShowImages(false);
    } catch (error) {
      console.error("Error fetching reimbursement details:", error);
    }
  };

  const filteredData = tableData
    .filter((item) => {
      const searchTerm = searchQuery.toUpperCase().trim();

      const username = item.username?.toUpperCase() || '';
      const billtype = item.billtype?.toUpperCase() || '';
      const approvalstatus = item.approvalstatus?.toUpperCase() || '';
      const amount = item.amount?.toString() || '';
      const purpose = item.purpose?.toUpperCase() || '';

      const itemDate = item.date?.trim() || '';
      const normalizedItemDate = itemDate.split('/').reverse().join('');
      const normalizedSearchQuery = searchQuery.split('/').reverse().join('');

      return (
        username.includes(searchTerm) ||
        normalizedItemDate.includes(normalizedSearchQuery) ||
        billtype.includes(searchTerm) ||
        approvalstatus.includes(searchTerm) ||
        amount.includes(searchTerm) ||
        purpose.includes(searchTerm)
      );
    })
    .sort((a, b) => {
      const dateA = a.date?.split('/').reverse().join('-') || '1970-01-01';
      const dateB = b.date?.split('/').reverse().join('-') || '1970-01-01';
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderItem = ({ item, index }: { item: TableData; index: number }) => (
    <View style={[tableStyles.row, { backgroundColor: index % 2 === 0 ? '#f2f0ed' : '#fff' }]}>
      <Text style={tableStyles.cell}>{item.date || 'N/A'}</Text>
      <Text style={tableStyles.cell}>{item.billtype}</Text>
      <Text style={tableStyles.cell}>{item.amount || 'N/A'}</Text>
      <TouchableOpacity onPress={() => fetchReimbursementDetails(item.id)}>
        <MaterialIcons name="visibility" size={25} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Navbar />
      <View style={tableStyles.container}>
        <TextInput
          style={tableStyles.searchInput}
          placeholder={`Search ${filteredData.length} items...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={tableStyles.header}>
          <Text style={tableStyles.headerCell}>{t('Date')}</Text>
          <Text style={tableStyles.headerCell}>{t('Billtype')}</Text>
          <Text style={tableStyles.headerCell}>{t('Amount')}</Text>
          <Text style={tableStyles.headerCell}>{t('View')}</Text>
        </View>

        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
            ) : (
              <Text style={tableStyles.emptyText}>No data available</Text>
            )
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={HealthreportStyle.modalContainer}>
            <View style={HealthreportStyle.heading}>
              <Text style={HealthreportStyle.text}>{t("ReimbursmentList")}</Text>
            </View>
            <View style={HealthreportStyle.modalContent}>
              {selectedReimbursement && (
                <>
                  <View style={HealthreportStyle.rowone}>
                    <Text style={HealthreportStyle.labelone}>{t('Date')}</Text>
                    <Text style={HealthreportStyle.valueone}>{selectedReimbursement.date}</Text>
                  </View>

                  <View style={HealthreportStyle.rowone}>
                    <Text style={HealthreportStyle.labelone}>{t('Billtype')}</Text>
                    <Text style={HealthreportStyle.valueone}>
                      {selectedReimbursement.billtype?.toUpperCase() || 'N/A'}
                    </Text>
                  </View>

                  <View style={HealthreportStyle.rowone}>
                    <Text style={HealthreportStyle.labelone}>{t('Amount')}</Text>
                    <Text style={HealthreportStyle.valueone}>₹{selectedReimbursement.amount}</Text>
                  </View>

                  <View style={HealthreportStyle.rowone}>
                    <Text style={HealthreportStyle.labelone}>{t('purpose')}</Text>
                    <Text style={HealthreportStyle.valueone}>{selectedReimbursement.purpose}</Text>
                  </View>

                  <View style={HealthreportStyle.rowone}>
                    <Text style={HealthreportStyle.labelone}>ApprovalStatus</Text>
                    <Text style={HealthreportStyle.valueone}>{selectedReimbursement.approvalStatus}</Text>
                  </View>

                  <View style={HealthreportStyle.rowone}>
                    <Text style={HealthreportStyle.labelone}>StartTrip Reading</Text>
                    <Text style={HealthreportStyle.valueone}>{selectedReimbursement.startTripReading}</Text>
                  </View>

                  <View style={HealthreportStyle.rowone}>
                    <Text style={HealthreportStyle.labelone}>EndTrip Reading</Text>
                    <Text style={HealthreportStyle.valueone}>{selectedReimbursement.endTripReading}</Text>
                  </View>


                  <View style={HealthreportStyle.rowone}>
                    <Text style={HealthreportStyle.labelone}>Images</Text>
                    {selectedReimbursement.images && selectedReimbursement.images.length > 0 && (
                      <TouchableOpacity onPress={() => setShowImages(!showImages)}>
                        <Icon name="visibility" size={24} color="#007AFF" />
                      </TouchableOpacity>
                    )}
                    {/* Modal to Show Images */}


                    <ImageViewing
                  images={selectedReimbursement.images.map((file: string) => ({ uri: api.defaults.baseURL + file }))}
                  imageIndex={0}
                  visible={showImages}
                  onRequestClose={() => setShowImages(false)}
                />

                         
               
                   


                  </View>



                </>
              )}
              <TouchableOpacity
                style={tableStyles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: 'white' }}>{t('Close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default ReimbursementList;