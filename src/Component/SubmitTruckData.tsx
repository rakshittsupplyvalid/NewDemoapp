import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, PermissionsAndroid } from "react-native";
import styles from '../theme/Healthreport';
import { useRoute, RouteProp } from "@react-navigation/native";
import api from '../service/api/apiInterceptors';
import Navbar from "../../App/Navbar";
import { Picker } from "@react-native-picker/picker";

import { MMKV } from 'react-native-mmkv';

type RouteParams = {
  params: {
    truckData: {
      truckNumber: string;
      date: string;
      grossWeight?: number | null;
      netWeight?: number | null;
      tareWeight?: number | null;
      stainingColourPercent?: number | null;
      BlackSmutPercent?: number | null;
      sproutedPercent?: number | null;
      spoiledPercent?: number | null;
      onionSkinPercent?: number | null;
      moisturePercent?: number | null;
      SpoliedPercent?: number | null;
      SpoliedComment: string;
      bagCount?: number | null;
      size?: number | null;
      Branchpersonname: string;
      imageUri: string[];
    };
  };
};

type ImageAsset = {
  uri: string;
  fileName: string;
  type: string;
};

const SubmitTruckData = () => {
  const route = useRoute<RouteProp<RouteParams, 'params'>>();
  const { truckData } = route.params;
  const [selectedCompany, setSelectedCompany] = useState("");
    const [selectedHelthReport, setHelthReportCompany] = useState('');
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [destinationBranch, setDestinationBranch] = useState([]);
  const [destinationDistrict, setDestinationDistrict] = useState([]);
  const [selectedbranchs, setSelectedbranch] = useState("");
  const [selectedDistrict, setSelecteddistrict] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [previousSteps, setPreviousSteps] = useState<number[]>([]);
  const [companyId, setCompanyId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [data2, setData2] = useState([]);
  const [imageUri, setImageUri] = useState<ImageAsset[]>([]);


  const storage = new MMKV();

  // Convert date to UTC ISO format
const utcDate = new Date(truckData.date).toISOString();

// Logging for debug
console.log('Original Date:', truckData.date);
console.log('UTC Date:', utcDate);





  const handleSubmit = async () => {

    const formData = new FormData();
    formData.append("DestinationBranch", selectedCompanyName)
    formData.append("StorageId", selectedbranchs);
    formData.append('TruckNumber', truckData.truckNumber);
    formData.append('Date', utcDate);

    formData.append('GrossWeight', truckData.grossWeight?.toString() || '0');
    formData.append('TareWeight', truckData.tareWeight?.toString() || '0');
    formData.append('NetWeight', truckData.netWeight?.toString() || '0');
    formData.append('BagCount', truckData.bagCount?.toString() || '0');
    formData.append('Size', truckData.size?.toString() || '0');
    formData.append('StainingColourPercent', truckData.stainingColourPercent?.toString() || '0');
    formData.append('BlackSmutPercent', truckData.BlackSmutPercent?.toString() || '0');
    formData.append('SproutedPercent', truckData.sproutedPercent?.toString() || '0');
    formData.append('SpoiledPercent', truckData.spoiledPercent?.toString() || '0');
    formData.append('OnionSkinPercent', truckData.onionSkinPercent?.toString() || '0');
    formData.append('MoisturePercent', truckData.moisturePercent?.toString() || '0');
    formData.append('SpoliedPercent', truckData.SpoliedPercent?.toString() || '0');
    formData.append('FPCPersonName', truckData.Branchpersonname);

    formData.append('SpoliedComment', truckData.SpoliedComment?.toString() || '0');


    formData.append('Date', truckData.date);
    // formData.append('Date', updatedata);
    // Image Upload
    if (truckData.imageUri) {
      truckData.imageUri.forEach((image: ImageAsset | string) => {
        formData.append('Files', {
          uri: typeof image === 'string' ? image : image.uri,
          name: typeof image === 'string' ? 'image.jpg' : image.fileName || 'image.jpg',
          type: typeof image === 'string' ? 'image/jpeg' : image.type || 'image/jpeg',
        } as any);
      });


    }

     try {
  const endpoint =
    selectedHelthReport === 'ca'
      ? '/api/healthreport/ca/receive'
      : '/api/healthreport/normal/receive';

  const response = await api.post(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImViNjU3NjBjLTE4ODQtNDlmYi1iZDJlLWZkYjQwYWIwNDhkZSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InR5YWdpcmFrc2hpdDczMUBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9tb2JpbGVwaG9uZSI6Ijk5OTA2NjUzNTgiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiOTk5MDY2NTM1OCIsImp0aSI6ImM3Zjk4OTFlLTNhMjYtNGM2OC1iMjE1LWI2OTQzY2VlN2Y2MiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkdyYWRlVXNlciIsIkdyb3VwVHlwZSI6IlNVUEVSR1JPVVAiLCJHcm91cElkIjoiYzQ3NjY5ODEtNjk0NS00ZGFmLThjNGUtNGI2NGJiZWQ4YjQ5IiwiSGVpcmFyY2h5IjoiW10iLCJCcmFuY2hUeXBlIjoiIiwiZXhwIjoxNzQ3MTMwOTg1LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjYxOTU1IiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo0MjAwIn0.7W8Hd3Q3csGddtufTh0oFrCvCq651Gm-ensPZul_SOg',
    },
  });

  if (response.status === 200 || response.status === 201) {
    // Delete formData from storage
    storage.delete('formData');

    // Remove from offlineForms list
    const existingOfflineData = storage.getString("offlineForms");
    let parsedOfflineData = existingOfflineData ? JSON.parse(existingOfflineData) : [];

    const filteredOfflineData = parsedOfflineData.filter((form: any) => {
      return !(form.truckNumber === truckData.truckNumber && form.date === truckData.date);
    });

    storage.set("offlineForms", JSON.stringify(filteredOfflineData));

    console.log('Data submitted and removed from MMKV!');
    alert('Health Report Submitted Successfully!');

    // Reset everything
   setSelectedCompanyName('');
    setCompanyId('');
    setData2([]);
    setDestinationBranch([]);
    setDestinationDistrict([]);
    setBranchId('');
    setImageUri([]);
    setCurrentStep(1);

    console.log('response', response.data);
  }

} catch (error) {
  console.log("Error submitting form:", error);
  alert("Submission failed. Please try again.");
  
}

  };


  useEffect(() => {
    fetchData2();
  }, []);

  useEffect(() => {

    if (companyId) fetchData3(companyId);
  }, [companyId]);


  useEffect(() => {
  }, [destinationDistrict]);


  const fetchData2 = async () => {
    try {
      const response = await api.get("/api/group?GroupType=BRANCH&BranchType=RECEIVING&ApprovalStatus=APPROVED&IsActive=true&IsActive=false");
      setData2(response.data);
    } catch (error) {
      console.error("Error fetching data2:", error);
      console.log("Error fetching data2:", error);
    }
  };

  const fetchData3 = async (value) => {
    try {
      const response = await api.get(
        `/api/dropdown/group/${value}/location`
      );
      setDestinationBranch(response.data);
    } catch (error) {
      console.error("Error fetching data3:", error);
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


          
               <View style={styles.content}>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedHelthReport}
                    onValueChange={(itemValue) => {
                      setHelthReportCompany(itemValue);
                      // You might want to reset the form when changing report type
                      
                    }}
                  >
                    <Picker.Item label="Select Healthreport Type" value="" />
                    <Picker.Item label="Normal" value="normal" />
                    <Picker.Item label="CA" value="ca" />
                  </Picker>


                </View>
              

              <View style={styles.content}>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedCompany}
                    onValueChange={(value) => {
                      setSelectedCompany(value);
                      setCompanyId(value);

                      // ID ke basis pe selected object dhoondo
                      const selectedCompanyObj = data2.find(item => item.id === value);
                      if (selectedCompanyObj) {
                        setSelectedCompanyName(selectedCompanyObj.id);
                        console.log('Selected ID:', selectedCompanyObj.id);
                        console.log('Selected Name:', selectedCompanyObj.name);
                      }
                    }}
                  >
                    <Picker.Item label="Select Company" value="" />
                    {data2.map((item, idx) => (
                      <Picker.Item key={idx} label={item.name} value={item.id} />
                    ))}
                  </Picker>

                </View>
              </View>


              <View style={styles.content}>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedbranchs}
                    onValueChange={(value) => {
                      setBranchId(String(value));
                      const selectedBranch = destinationBranch.find(item => item.id === value);
                      if (selectedBranch) {
                        setSelectedbranch(selectedBranch.value);
                      }
                    }}
                  >
                    <Picker.Item label="Select Branch" value="" />
                    {destinationBranch.map((item, idx) => (
                      <Picker.Item key={idx} label={item.text} value={item.id} />
                    ))}
                  </Picker>
                </View>

              </View>






              <View style={styles.buttoncontent}>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>



            </View>
          





{/*           
          <View >
            <Text>Truck Numbser: {truckData.truckNumber}</Text>
            <Text>Date: {truckData.date}</Text>
            <Text> GrossWeight: {truckData.grossWeight}</Text>
            <Text> Net weight : {truckData.netWeight}</Text>
            <Text> Tare weight : {truckData.tareWeight}</Text>
            <Text> stainingColourPercent : {truckData.stainingColourPercent}</Text>
            <Text>  BlackSmutPercent : {truckData.BlackSmutPercent}</Text>
            <Text>  sproutedPercent : {truckData.sproutedPercent}</Text>
            <Text>   spoiledPercent : {truckData.spoiledPercent}</Text>

          </View> */}

        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>


  );
};

export default SubmitTruckData;
