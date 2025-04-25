import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import api from '../service/api/apiInterceptors';
import useForm from '../App/common/lib/useForm';
import styles from '../theme/Healthreport';
import { useTranslation } from 'react-i18next';
import Navbar from '../App/Navbar';

const GenerateHealthReport = () => {
  const { state, handleNext, updateState, handleConfirm } = useForm();

  const { t, i18n } = useTranslation();

  const today = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(today.getMonth() - 3);



  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (state.selectedCompany) {
      fetchBranches(state.selectedCompany);
    } else {
      updateState({ Branchdata: [] });
    }
  }, [state.selectedCompany]);

  useEffect(() => {
    if (state.selectedBranch) {
      fetchDistrict(state.selectedBranch);
    } else {
      updateState({ districtData: [] });
    }
  }, [state.selectedBranch]);

  const fetchCompanies = async () => {
    try {
      const response = await api.get("/api/dropdown/company");
      updateState({ companydata: response.data || [] });
    } catch (error) {
      console.error("Error fetching company data:", error);
      updateState({ companydata: [] });
    }
  };

  const fetchBranches = async (selectedCompany) => {
    if (!selectedCompany) {
      updateState({ Branchdata: [] });
      return;
    }
    try {
      const response = await api.get(`/api/group?GroupType=Branch&BranchType=Receiving&ApprovalStatus=APPROVED&CompanyId=${selectedCompany}`);
      // const branchArray = Array.isArray(response.data) ? response.data : response.data.data;
      updateState({ Branchdata: response.data || [] });
    } catch (error) {
      console.error("Error fetching branch data:", error);
      updateState({ Branchdata: [] });
    }
  };

  const fetchDistrict = async (branchId) => {
    if (!branchId) {
      console.log("Branch ID is empty, skipping district fetch.");
      updateState({ districtData: [] });
      return;
    }
    try {
      const response = await api.get(`/api/dropdown/group/${branchId}/location?locationType=GENERAL`);
      console.log("District API Raw Response:", response.data);
      const districtArray = Array.isArray(response.data) ? response.data : response.data.data;
      updateState({ districtData: districtArray || [] });
    } catch (error) {
      console.error("Error fetching district data:", error);
      updateState({ districtData: [] });
    }
  };



  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <SafeAreaView style={styles.container}>
        <Navbar />
        <ScrollView contentContainerStyle={styles.scrollView}>

          {state.currentstep === 1 && (
            <View style={styles.onecontainers}>
              <View style={styles.content}>
                <View style={styles.pickerContainer}>


                  <Picker
                    selectedValue={state.selectedCompany}
                    onValueChange={(value) => {
                      console.log("Company Picker selected:", value);
                      updateState({ selectedCompany: value, selectedBranch: '', selectedDistrict: '' });
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="-- Select Company --" value="" />
                    {state.companydata.length > 0 ? (
                      state.companydata.map((item, index) => (
                        <Picker.Item key={index} label={item.text} value={item.value} />
                      ))
                    ) : (
                      <Picker.Item label="No companies available" value="" enabled={false} />
                    )}
                  </Picker>
                </View>
              </View>

              <View style={styles.content}>
                <View style={styles.pickerContainer}>

                  <Picker
                    selectedValue={state.selectedBranch}
                    onValueChange={(value) => updateState({ selectedBranch: value, selectedDistrict: '' })}
                    style={styles.picker}
                    enabled={state.Branchdata.length > 0}
                  >
                    <Picker.Item label="-- Select Branch --" value="" />
                    {state.Branchdata.length > 0 ? (
                      state.Branchdata.map((item, index) => (
                        <Picker.Item key={index} label={item.name} value={item.id} />
                      ))
                    ) : (
                      <Picker.Item label="No branches available" value="" enabled={false} />
                    )}
                  </Picker>
                </View>
              </View>

              <View style={styles.content}>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={state.selectedDistrict}
                    onValueChange={(value) => updateState({ selectedDistrict: value })}
                    style={styles.picker}
                    enabled={state.districtData.length > 0}
                  >
                    <Picker.Item label="-- Select District --" value="" />
                    {state.districtData.length > 0 ? (
                      state.districtData.map((item, index) => (
                        <Picker.Item key={index} label={item.text} value={item.id} />
                      ))
                    ) : (
                      <Picker.Item label="No districts available" value="" enabled={false} />
                    )}
                  </Picker>
                </View>
              </View>

              <Button
                title="Next"
                onPress={() => {
                  console.log("Next button pressed, current step:", state.currentstep);
                  handleNext(2);
                }}
              />


            </View>
          )}

          {state.currentstep === 2 && (
            <View>
              <TextInput
                maxLength={12}
                style={styles.input}
                placeholder={t('TruckNumber')}
                value={state.truckNumber}
                autoCapitalize="characters"
                onChangeText={(text) => updateState({ truckNumber: text.toUpperCase() })}
              />

              <TextInput
                style={styles.input}
                placeholder={t('Grossweight')}
                value={state.grossWeight}
                onChangeText={(text) => updateState({ grossWeight: text })}
                keyboardType="numeric"
              />

              <TextInput
                style={styles.input}
                placeholder={t('Tareweight')}
                value={state.tareWeight}
                onChangeText={(text) => updateState({ tareWeight: text })}
                keyboardType="numeric"
              />

              <TextInput
                style={styles.input}
                placeholder={t('Netweight')}
                value={state.netWeight}
                onChangeText={(text) => updateState({ netWeight: text })}
                keyboardType="numeric"
              />

              {state.isDatePickerVisible && (
                <DateTimePicker
                  value={state.date ? new Date(state.date) : new Date()}
                  mode="date"
                  onChange={(event, selectedDate) => handleConfirm(selectedDate, "date")}
                />
              )}

              {state.isTimePickerVisible && (
                <DateTimePicker
                  value={new Date()}
                  mode="time"
                  onChange={(event, selectedTime) => handleConfirm(selectedTime, "time")}
                />
              )}

              <TouchableOpacity onPress={() => updateState(prev => ({ ...prev, isDatePickerVisible: true }))}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    editable={false}
                    value={
                      state.date
                        ? `${new Date(state.date).toLocaleDateString()} ${state.time ? new Date(state.time).toLocaleTimeString() : ""}`
                        : 'Select Date'
                    }
                  />
                </View>
              </TouchableOpacity>


              <TextInput
                style={styles.input}
                placeholder={t('Bagcount')}
                value={state.bagCount}
                onChangeText={(text) => updateState({ bagCount: text })}
              />

              <TextInput
                style={styles.input}
                placeholder={t('Size')}
                value={state.size}
                onChangeText={(text) => updateState({ size: text })}
              />






            </View>




          )}
          {state.currentstep === 3 && (
            <View>



            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default GenerateHealthReport;


