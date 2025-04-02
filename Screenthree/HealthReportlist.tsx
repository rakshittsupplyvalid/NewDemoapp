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
import Navbar from '../App/Navbar';
import api from '../service/api/apiInterceptors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImageViewing from "react-native-image-viewing";
import { format, isWithinInterval } from 'date-fns';
import moment from "moment";

import { HealthreportStyle } from '../theme/HealthreportStyle';


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
  const [pageSize, setPageSize] = useState(10); // Default page size




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
        `/api/healthreport?ReportType=RECEIVE&PageNumber=${pageNumber}&PageSize=${pageSize}&AssayerId=${userId}`
      );

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
      filteredData = filteredData.filter(item =>
        item.assayername.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.trucknumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (startDate && endDate) {
      filteredData = filteredData.filter(item => {
        const reportDate = new Date(item.date);
        return isWithinInterval(reportDate, { start: startDate, end: endDate });
      });
    }

    setFilteredReports(filteredData);
  }, [searchQuery, startDate, endDate, reports]);


  const fetchReportDetails = async (id: any) => {
    try {
      const response = await api.get(`/api/healthreport/${id}`);
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
        placeholder="Search Assayer Name and date"
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
                <Text style={HealthreportStyle.label}>Assayer Name:</Text>
                <Text style={HealthreportStyle.value}>{item.assayername}</Text>
              </View>
              <View style={HealthreportStyle.row}>
                <Text style={HealthreportStyle.label}>Date:</Text>
                <Text style={HealthreportStyle.value}>
                  {moment(item.date).add(5, "hours").format("DD-MM-YYYY")}
                </Text>
              </View>
              <View style={HealthreportStyle.row}>
                <Text style={HealthreportStyle.label}>Truck Number:</Text>
                <Text style={HealthreportStyle.value}>{item.trucknumber}</Text>
              </View>
              <View style={HealthreportStyle.parentbutton}>
                <TouchableOpacity style={HealthreportStyle.button} onPress={() => fetchReportDetails(item.id)}>
                  <Text style={HealthreportStyle.buttonText}>View Report</Text>
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
            <Text style={HealthreportStyle.text} >Recieve Health Report Details</Text>
          </View>
          <View style={HealthreportStyle.modalContent}>

            {selectedReport && (
              <>
                <View style={HealthreportStyle.rowone}>
                  <Text style={HealthreportStyle.labelone}>Truck Number:</Text>
                  <Text style={HealthreportStyle.valueone}>{selectedReport.trucknumber}</Text>
                </View>

                <View style={HealthreportStyle.rowone}>
                  <Text style={HealthreportStyle.labelone}>Date:</Text>
                  <Text style={HealthreportStyle.valueone}>
                    {new Date(selectedReport.date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </Text>





                </View>

                <View style={HealthreportStyle.rowone}>
                  <Text style={HealthreportStyle.labelone}>Approval Status:</Text>
                  <Text style={HealthreportStyle.valueone}>{selectedReport.approvalstatus}</Text>
                </View>

                {selectedReport.datastring && (() => {
                  const parsedData = JSON.parse(selectedReport.datastring);
                  return (
                    <>
                      {/* <View style={styles.rowone}>
                        <Text style={styles.labelone}>Destination Branch:</Text>
                        <Text style={styles.valueone}>{parsedData.CNAName}duti</Text>
                      </View>
                      <View style={styles.rowone}>
                        <Text style={styles.labelone}>Storage Name:</Text>
                        <Text style={styles.valueone}>{parsedData.StorageName}</Text>
                      </View> */}
                      <View style={HealthreportStyle.rowone}>
                        <Text style={HealthreportStyle.labelone}>Gross Weight:</Text>
                        <Text style={HealthreportStyle.valueone}>{parsedData.GrossWeight}</Text>
                      </View>
                      <View style={HealthreportStyle.rowone}>
                        <Text style={HealthreportStyle.labelone}>Net Weight:</Text>
                        <Text style={HealthreportStyle.valueone}>{parsedData.NetWeight}</Text>
                      </View>
                      <View style={HealthreportStyle.rowone}>
                        <Text style={HealthreportStyle.labelone}>Tare Weight:</Text>
                        <Text style={HealthreportStyle.valueone}>{parsedData.TareWeight}</Text>
                      </View>
                    </>
                  );
                })()}



                <View style={HealthreportStyle.rowone}>
                  <Text style={HealthreportStyle.labelone}>Images:</Text>
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
              <Text style={HealthreportStyle.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>

        </View>
      </Modal>
    </SafeAreaView>
  );
};



export default HealthReportlist;
