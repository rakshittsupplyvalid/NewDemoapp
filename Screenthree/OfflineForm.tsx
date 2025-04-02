import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Switch, ScrollView } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../theme/Healthreport';
import moment from "moment";
import { MMKV } from 'react-native-mmkv';
import NetInfo from "@react-native-community/netinfo";
import axios from 'axios';
import { Picker } from "@react-native-picker/picker";


const storage = new MMKV();

const OfflineForm = () => {

  const [truckNumber, setTruckNumber] = useState('');
  const [grossWeight, setGrossWeight] = useState('');
  const [netWeight, setNetWeight] = useState('');
  const [tareWeight, setTareWeight] = useState('');
  const [bagCount, setBagCount] = useState('');
  const [size, setSize] = useState('');



  const [isComment, setIsComment] = useState(false);
  const [open, setOpen] = useState(false);

  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [selectedbranchs, setSelectedbranch] = useState("");
  const [selectedDistrict, setSelecteddistrict] = useState("");


  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [previousSteps, setPreviousSteps] = useState<number[]>([]);
  const [companyId, setCompanyId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [locationId, setLocationId] = useState('');


  const [stainingColour, setStainingColour] = useState(false);
  const [stainingColourPercent, setStainingColourPercent] = useState('');
  const [blackSmutOnion, setBlackSmutOnion] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const [BlackSmutPercent, setBlackSmatPercent] = useState('');
  const [sproutedOnion, setSproutedOnion] = useState(false);
  const [sproutedPercent, setSproutedPercent] = useState('');
  const [spoiledOnion, setSpoiledOnion] = useState(false);
  const [spoiledPercent, setSpoiledPercent] = useState('');
  const [onionSkin, setOnionSkin] = useState('SINGLE');
  const [moisture, setMoisture] = useState('DRY');
  const [onionSkinPercent, setOnionSkinPercent] = useState('');
  const [moisturePercent, setMoisturePercent] = useState('');
  const [fpcPersonName, setFpcPersonName] = useState('');
  const [isSpoiledPercentVisible, setIsSpoiledPercentVisible] = useState(false);
  const [SpoliedPercent, setSpoliedPercent] = useState('');
  const [SpoliedBranch, setSpoliedBranch] = useState('');
  const [SpoliedComment, setSpoliedComment] = useState('');

  const today = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(today.getMonth() - 3);








  const saveFormOffline = (formData) => {
    try {
      let existingData = storage.getString('offlineForms');
      let offlineForms = existingData ? JSON.parse(existingData) : [];

      offlineForms.push(formData);

      console.log('Offline Forms to be saved:', JSON.stringify(offlineForms, null, 2));

      storage.set('offlineForms', JSON.stringify(offlineForms));

      Alert.alert("Offline Mode", "Form saved offline successfully!");

      // **Check Saved Data**
      let savedData = storage.getString('offlineForms');
      console.log('Saved Offline Forms:', JSON.stringify(JSON.parse(savedData), null, 2));

    } catch (error) {
      console.error('Error saving form:', error);
    }
  };






  const handleNext = (nextStep: number) => {
    setPreviousSteps([...previousSteps, currentStep]);
    setCurrentStep(nextStep);

    // Save form locally if offline
    NetInfo.fetch().then(state => {
      if (!state.isConnected) {
        saveFormOffline({
          truckNumber, grossWeight, tareWeight, netWeight, bagCount, size, date, stainingColourPercent, BlackSmutPercent, sproutedPercent, spoiledPercent, onionSkinPercent, moisturePercent, SpoliedPercent , SpoliedComment
        });
      }
    });
  };

  const handlePrevious = (


  ) => {
    if (previousSteps.length > 0) {
      const lastStep = previousSteps[previousSteps.length - 1]; // Get the last step

      setPreviousSteps(previousSteps.slice(0, -1)); // Remove last step from history
      setCurrentStep(lastStep);
    }

  };



  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate: any, type: "date" | "time") => {
    if (selectedDate) {
      if (type === "date") {
        const formattedDate = moment(selectedDate).format("YYYY-MM-DD"); // 🔹 UTC hata diya
        setDate(formattedDate);
        console.log("Formatted date:", formattedDate);
        hideDatePicker();
        setTimePickerVisibility(true);
      } else if (type === "time") {
        const formattedTime = moment(selectedDate).format("HH:mm:ss"); // 🔹 Local time liya

        setDate((prevDate) => {
          const dateTime = `${prevDate} ${formattedTime}`;
          console.log("Formatted Date & Time:", dateTime);
          return dateTime;
        });

        setTimePickerVisibility(false);
      }
    }
  };

    useEffect(() => {
  
      const gross = parseFloat(grossWeight) || 0;
      const tare = parseFloat(tareWeight) || 0;
      setNetWeight((gross - tare).toString());
    }, [grossWeight, tareWeight]);
  


  return (


    <View style={styles.offlinecontainers}>

      <ScrollView contentContainerStyle={styles.scrollView}>


        {currentStep === 1 && (
          <View style={styles.secondcontainers}>

            <TextInput
              maxLength={12}
              style={styles.input}
              placeholder="Truck Number"
              value={truckNumber}
              autoCapitalize="characters"
              onChangeText={(text) => setTruckNumber(text.toUpperCase())}
            />


            <TextInput
              style={styles.input}
              placeholder="Gross Weight(KG)"
              value={grossWeight}
              onChangeText={setGrossWeight}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Tare Weight(KG)"
              value={tareWeight}
              onChangeText={setTareWeight}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Net Weight(KG)"
              value={netWeight}

              keyboardType="numeric"
            />



            {isDatePickerVisible && (
              <DateTimePicker
                value={date ? new Date(date) : new Date()}
                mode="date"
                onChange={(event, selectedDate) => handleConfirm(selectedDate, "date")}
                display="default"
                minimumDate={threeMonthsAgo} // Set minimum date to 3 months ago
                maximumDate={today} // Set maximum date to today
              />
            )}

            {isTimePickerVisible && (
              <DateTimePicker
                value={new Date()} // Default value current time
                mode="time"
                onChange={(event, selectedTime) => handleConfirm(selectedTime, "time")}
                display="default"
              />
            )}


            <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  editable={false} // User manually edit nahi kar sakta
                  value={
                    date
                      ? `${new Date(date).toLocaleDateString()} ${time ? new Date(time).toLocaleTimeString() : ""}`
                      : "Select Date & Time"
                  }
                />
              </View>
            </TouchableOpacity>




            <TextInput
              style={styles.input}
              placeholder="Bag Count"
              value={bagCount}
              onChangeText={setBagCount}
              keyboardType="numeric"
            />
            {
              isComment == false ?
                (<TextInput
                  style={styles.input}
                  placeholder="Size"
                  value={size}
                  onChangeText={setSize}
                  keyboardType="numeric"
                />) : (
                  <>
                  </>
                )
            }


            <View style={styles.buttoncontent} >
              <TouchableOpacity style={styles.button} onPress={() => handleNext(currentStep + 1)}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>


              <TouchableOpacity style={styles.button} onPress={handlePrevious}>
                <Text style={styles.buttonText}>Previous</Text>
              </TouchableOpacity>

              {/* 
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity> */}

            </View>







          </View>
        )}

        {currentStep === 2 && (
          <View>


            <View style={styles.thirdcontainers}>
              <View style={styles.switchContainer}>
                <Text style={styles.text}>Staining Colour</Text>
                <Switch
                  value={stainingColour}
                  onValueChange={(value) => {
                    setStainingColour(value);
                    if (!value) setStainingColourPercent('');
                  }}
                  trackColor={{ false: '#F6A00191', true: '#FF9500' }} // Red track when ON
                  thumbColor={stainingColour ? 'white' : '#f4f3f4'} // White thumb when ON
                />
              </View>
              {stainingColour && (
                <TextInput
                  style={styles.input}
                  placeholder="Staining Colour Percent"
                  value={stainingColourPercent}
                  onChangeText={(text) => setStainingColourPercent(text)}
                  keyboardType="numeric"
                />
              )}

              <View style={styles.switchContainer}>
                <Text style={styles.text}>Black Smut Onion</Text>
                <Switch
                  value={blackSmutOnion}
                  onValueChange={(value) => {
                    setBlackSmutOnion(value);
                    if (!value) setBlackSmatPercent('');
                  }}
                  trackColor={{ false: '#F6A00191', true: '#FF9500' }} // Red track when ON
                  thumbColor={stainingColour ? 'white' : '#f4f3f4'} // White thumb when ON
                />
              </View>
              {blackSmutOnion && (
                <TextInput
                  style={styles.input}
                  placeholder="Black Smut Percent"
                  value={BlackSmutPercent}
                  onChangeText={(text) => setBlackSmatPercent(text)}
                  keyboardType="numeric"
                />
              )}


              <View style={styles.switchContainer}>
                <Text style={styles.text}>Sprouted Onion</Text>
                <Switch
                  value={sproutedOnion}
                  onValueChange={(value) => {
                    setSproutedOnion(value);
                    if (!value) setSproutedPercent('');
                  }}
                  trackColor={{ false: '#F6A00191', true: '#FF9500' }} // Red track when ON
                  thumbColor={stainingColour ? 'white' : '#f4f3f4'} // White thumb when ON
                />
              </View>
              {sproutedOnion && (
                <TextInput
                  style={styles.input}
                  placeholder="Sprouted Percent"
                  value={sproutedPercent}
                  onChangeText={(text) => setSproutedPercent(text)}
                  keyboardType="numeric"
                />
              )}

              <View style={styles.switchContainer}>
                <Text style={styles.text}>Spoiled Onion</Text>
                <Switch
                  value={spoiledOnion}
                  onValueChange={(value) => {
                    setSpoiledOnion(value);
                    if (!value) setSpoiledPercent('');
                  }}
                  trackColor={{ false: '#F6A00191', true: '#FF9500' }} // Red track when ON
                  thumbColor={stainingColour ? 'white' : '#f4f3f4'} // White thumb when ON
                />
              </View>
              {spoiledOnion && (
                <TextInput
                  style={styles.input}
                  placeholder="Spoiled Percent"
                  value={spoiledPercent}
                  onChangeText={(text) => setSpoiledPercent(text)}
                  keyboardType="numeric"
                />
              )}

              {/* OnionSkin Dropdown */}
              <View style={styles.dropdownContainer}>
                <Text style={styles.text}>Onion Skin</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={onionSkin}
                    onValueChange={(itemValue) => {
                      setOnionSkin(itemValue);
                      if (itemValue === "DOUBLE") {
                        setOnionSkinPercent("0"); // DOUBLE select hone par value 0 set karo
                      } else {
                        setOnionSkinPercent(""); // SINGLE ke liye input blank rakho
                      }
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="DOUBLE" value="DOUBLE" />
                    <Picker.Item label="SINGLE" value="SINGLE" />
                  </Picker>
                </View>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Onion Skin Percent"
                value={onionSkinPercent}
                onChangeText={setOnionSkinPercent}
                keyboardType="numeric"
                editable={onionSkin === "SINGLE"} // SINGLE hone par editable, DOUBLE hone par non-editable
              />



              {/* Moisture Dropdown */}
              <View style={styles.dropdownContainer}>
                <Text style={styles.text}>Moisture</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={moisture}
                    onValueChange={(itemValue) => {
                      setMoisture(itemValue);
                      if (itemValue === "DRY") {
                        setMoisturePercent("0"); // DRY select hone par 0 set karo
                      } else {
                        setMoisturePercent(""); // WET hone par blank input allow karo
                      }
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="DRY" value="DRY" />
                    <Picker.Item label="WET" value="WET" />
                  </Picker>
                </View>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Moisture Percent"
                value={moisturePercent}
                onChangeText={setMoisturePercent}
                keyboardType="numeric"
                editable={moisture === "WET"} // Sirf WET hone par editable hoga
              />



              <Text style={styles.text}>Spoiled</Text>

              <Switch
                value={isSpoiledPercentVisible}
                onValueChange={setIsSpoiledPercentVisible}
              />

              {isSpoiledPercentVisible && (
                <TextInput
                  style={styles.input}
                  placeholder="Spoiled Percent"
                  value={SpoliedPercent}
                  onChangeText={setSpoliedPercent}
                  keyboardType="numeric"
                />
              )}

              <TextInput
                style={styles.input}
                placeholder="Type Comments"
                value={SpoliedComment}
                onChangeText={setSpoliedComment}
              />


              <TextInput
                style={styles.input}
                placeholder="Branch Person name"
                value={SpoliedBranch}
                onChangeText={setSpoliedBranch}

              />


              <View style={styles.buttoncontent} >
     

                <TouchableOpacity style={styles.button} onPress={handlePrevious}>
                  <Text style={styles.buttonText}>Previous</Text>
                </TouchableOpacity>



                <TouchableOpacity style={styles.button} onPress={() => handleNext(currentStep + 1)}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>


              </View>


            </View>






          </View>
        )}

      </ScrollView>



    </View>

  );
};



export default OfflineForm;
