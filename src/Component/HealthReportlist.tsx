import React, { useEffect, useState } from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  View,
  TouchableOpacity,
  Image,
  TextInput
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Navbar from '../../App/Navbar';
import api from '../service/api/apiInterceptors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImageViewing from "react-native-image-viewing";

import moment from "moment";
import { useTranslation } from 'react-i18next';
import { HealthreportStyle } from '../theme/HealthreportStyle';

import { useFocusEffect } from '@react-navigation/native';



const HealthReportlist = () => {
  const [profileData, setProfileData] = useState(null);
  const [userId, setUserId] = useState(""); // Store user ID
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showImages, setShowImages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  const [hasMoreData, setHasMoreData] = useState(true);
  const pageSize = 30; // Default page size
  const { t, i18n } = useTranslation();






  useFocusEffect(
    React.useCallback(() => {
      setSearchQuery('');
    }, [])
  );





  const fetchProfile = async (): Promise<void> => {
    try {
      const response = await api.get("/api/user/profile");
      setProfileData(response.data);
      setUserId(response.data.id); // Assuming ID field is 'id'

    } catch (err) {
      console.error("Error fetching profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async (isInitialLoad = false) => {
    if (!hasMoreData || loading || !userId) return;

    setLoading(true);
    try {
      const response = await api.get(
        `/api/healthreport?ReportType=RECEIVE`
      );
     

      console.log('resposne' , response.data )


      const newReports = response.data || [];
      if (isInitialLoad) {
        setReports(newReports);
      } else {
        setReports((prevReports) => [...prevReports, ...newReports]);
      }

      setHasMoreData(newReports.length === pageSize);
      if (newReports.length === pageSize) {
        setPageNumber((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error fetching health reports:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);


  useEffect(() => {
    if (userId) {
      setPageNumber(1);
      setHasMoreData(true);
      fetchReports(true);
    }
  }, [userId, pageSize]);


  useEffect(() => {
    let filteredData = reports;

    if (searchQuery) {
      filteredData = filteredData.filter(item => {
        const formattedDate = moment(item.date).add(5, "hours").format("DD-MM-YYYY");
        return (
          item.assayerName.toUpperCase().includes(searchQuery.toUpperCase()) ||
          item.truckNumber.toUpperCase().includes(searchQuery.toUpperCase()) ||
          formattedDate.includes(searchQuery)
        );
      });
    }

    setFilteredReports(filteredData);
  }, [searchQuery, reports]);


  const fetchReportDetails = async (id: any) => {
    try {
      const response = await api.get(`/api/healthreport/${id}`);
      console.log('recieve', response)
      setSelectedReport(response.data);
      setModalVisible(true);
      setShowImages(false);
    } catch (error) {
      console.error('Error fetching report details:', error);
    }
  };



  return (
    <SafeAreaView style={HealthreportStyle.container}>
      <Navbar />

      <TextInput
        style={HealthreportStyle.searchInput}
        placeholder={t('SearchAssayerNameanddate')}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* <View style={HealthreportStyle.dateFilterContainer}>
        <TouchableOpacity style={HealthreportStyle.dateButton} onPress={() => setShowStartPicker(true)}>
          <Text style={HealthreportStyle.buttonText}>{startDate ? startDate.toDateString() : "Start Date"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={HealthreportStyle.dateButton} onPress={() => setShowEndPicker(true)}>
          <Text style={HealthreportStyle.buttonText}>{endDate ? endDate.toDateString() : "End Date"}</Text>
        </TouchableOpacity>
      </View> */}

      {/* Pagination Picker */}
      {/* <View >
        <Text style={HealthreportStyle.label}>Reports per page:</Text>
        <Picker
          selectedValue={pageSize}
          onValueChange={(itemValue) => {
            setPageSize(itemValue);
            setReports([]);
            setPageNumber(1);
          }}
        
        >
          <Picker.Item label="10" value={10} />
          <Picker.Item label="20" value={15} />
          <Picker.Item label="30" value={30} />
        </Picker>
      </View> */}

      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) setEndDate(selectedDate);
          }}
        />
      )}

      <FlatList
        data={filteredReports}

        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={HealthreportStyle.one}>
            <View style={HealthreportStyle.card}>
              <View style={HealthreportStyle.topRightCorner} />
              <View style={HealthreportStyle.bottomLeftCorner} />
              <View style={HealthreportStyle.row}>
                <Text style={HealthreportStyle.label}>{t('assyarerName')}</Text>
                <Text style={HealthreportStyle.value}>{item.assayerName}</Text>
              </View>
              <View style={HealthreportStyle.row}>
                <Text style={HealthreportStyle.label}>{t('Date')}</Text>
                <Text style={HealthreportStyle.value}>
                  {moment(item.date).format("DD-MM-YYYY")}
                  {/* {new Date(item.date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })} */}
                </Text>
              </View>
              <View style={HealthreportStyle.row}>
                <Text style={HealthreportStyle.label}>{t('TruckNumber')}</Text>
                <Text style={HealthreportStyle.value}>{item.truckNumber}</Text>
              </View>
              <View style={HealthreportStyle.parentbutton}>
                <TouchableOpacity style={HealthreportStyle.button} onPress={() => fetchReportDetails(item.id)}>
                  <Text style={HealthreportStyle.buttonText}>{t('ViewReport')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        onEndReached={() => fetchReports(false)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" color="red" /> : null}
      />




      {/* Modal for Report Details */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={HealthreportStyle.modalContainer}>
          <View style={HealthreportStyle.heading}>
            <Text style={HealthreportStyle.text} >{t('RecieveHealthReportDetails')}</Text>
          </View>
          <View style={HealthreportStyle.modalContent}>

            {selectedReport && (
              <>
          
                <View style={HealthreportStyle.rowone}>
                  <Text style={HealthreportStyle.labelone}>{t('TruckNumber')}</Text>
                  <Text style={HealthreportStyle.valueone}>{selectedReport.truckNumber}</Text>
                </View>

                <View style={HealthreportStyle.rowone}>
                  <Text style={HealthreportStyle.labelone}>{t('Date')}</Text>
                  <Text style={HealthreportStyle.valueone}>
                    {new Date(selectedReport.date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </Text>
                </View>

                <View style={HealthreportStyle.rowone}>
                  <Text style={HealthreportStyle.labelone}>{t('ApprovalStatus')}:</Text>
                  <Text style={HealthreportStyle.valueone}>{selectedReport.approvalStatus}</Text>
                </View>

                
                <View style={HealthreportStyle.rowone}>
                  <Text style={HealthreportStyle.labelone}>{t('GrossWeight')}</Text>
                  <Text style={HealthreportStyle.valueone}>{selectedReport.grossWeight}</Text>
                </View>
                <View style={HealthreportStyle.rowone}>
                  <Text style={HealthreportStyle.labelone}>{t('NetWeight')}</Text>
                  <Text style={HealthreportStyle.valueone}>{selectedReport.netWeight}</Text>
                </View>
                <View style={HealthreportStyle.rowone}>
                  <Text style={HealthreportStyle.labelone}>{t('TareWeight')}</Text>
                  <Text style={HealthreportStyle.valueone}>{selectedReport.tareWeight}</Text>
                </View>


                <View style={HealthreportStyle.rowone}>
                  <Text style={HealthreportStyle.labelone}>Bag Count</Text>
                  <Text style={HealthreportStyle.valueone}>{selectedReport.bagCount}</Text>
                </View>


                <View style={HealthreportStyle.rowone}>
                  <Text style={HealthreportStyle.labelone}>{t('images')}</Text>
                  <TouchableOpacity onPress={() => setShowImages(!showImages)}>
                    <MaterialIcons
                      name={showImages ? 'visibility-off' : 'visibility'}
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>

                </View>


                <ImageViewing
                  images={selectedReport.files.map((file: string) => ({ uri: api.defaults.baseURL + file }))}
                  imageIndex={0}
                  visible={showImages}
                  onRequestClose={() => setShowImages(false)}
                />




                {showImages && (
                  <FlatList
                    data={selectedReport.files}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal={true}  // Horizontal scrolling
                    showsHorizontalScrollIndicator={false}  // Hide scrollbar
                    contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 20 }}
                    renderItem={({ item }) => (
                      <Image
                        source={{ uri: api.defaults.baseURL + item }}
                        style={HealthreportStyle.image}
                      />
                    )}
                  />
                )}



           
              </>
            )}

            <TouchableOpacity style={HealthreportStyle.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={HealthreportStyle.buttonText}>{t('Close')}</Text>
            </TouchableOpacity>


           
          </View>

        </View>
      </Modal>
    </SafeAreaView>
  );
};



export default HealthReportlist;
