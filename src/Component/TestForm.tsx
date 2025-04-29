import React, { useEffect, useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Switch, Modal, Image, FlatList, Button } from 'react-native';
import useForm from '../../App/common/lib/useForm';
import api from '../service/api/apiInterceptors';
import { Picker } from '@react-native-picker/picker';
import styles from '../theme/Healthreport';
import Navbar from '../../App/Navbar';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { PermissionsAndroid } from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { useIsFocused } from '@react-navigation/native';
import { createFormData } from '../../App/common/lib/Formdata';
import { validateStepOne, validateStepTwo, validateStepThree } from '../utils/FormValidation';// Assuming you have a validation function




const TestForm = () => {
  const { t } = useTranslation();
  const { state, updateState } = useForm();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const currentStep = state?.hidden?.currentStep || 0;
  const [selectedImage, setSelectedImage] = useState(null);
  const previousSteps = state?.hidden?.previousSteps || [];
  const isFocused = useIsFocused();

  const today = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(today.getMonth() - 3);

  useEffect(() => {
    if (isFocused) {
      updateState({ form: null, hidden: { ...state.hidden, currentStep: 0 } });  // Directly updating the state
    }
  }, [isFocused]);




  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (state.form?.onionSkin === 'DOUBLE') {
      updateState({
        ...state,
        form: {
          ...state.form,
          onionSkinPercent: '0'
        }
      });
    }
  }, [state.form?.onionSkin]);

  const loadData = () => {
    const url = '/api/dropdown/company';
    api.get(url).then((res) => {
      if (res?.data) {
        console.log("API Response Data:", res.data);
        const updatedState = {
          ...state,
          fielddata: {
            ...state.fielddata,
            companyid: res.data
          }
        };
        console.log("Updated State Data:", updatedState);
        updateState(updatedState);
      } else {
        console.log("No data found in API response.");
      }
    }).catch((error) => {
      console.log("Error fetching data:", error);
    });
  };

  const handleSelectedCompany = (value) => {
    const selectedCompany = state?.fielddata?.companyid?.find(company => company.value === value);
    const companyName = selectedCompany ? selectedCompany.text : '';
    updateState({

      form: { 'CNAName': companyName, companyId: value, branchvalue: '', DestinationDistrict: '' },
      fielddata: { branchid: [], districtid: [] }
    });
    if (!value) return;
    let fielddata = { branchid: [] }
    const url = `/api/group?GroupType=Branch&BranchType=Receiving&ApprovalStatus=APPROVED&CompanyId=${value}`;
    api.get(url).then((res) => {
      if (res?.data) {
        fielddata.branchid = res.data.map((item) => ({
          id: item.id,
          name: item.name
        }));
        updateState({ fielddata });
      }
    });
  };

  const handleSelectedBranch = (value) => {
    const selectbranch = state?.fielddata?.branchid?.find(x => x.id == value);
    const branchname = selectbranch ? selectbranch.name : '';
    updateState({

      form: { 'DestinationBranch': branchname, branchvalue: value, districtid: '' },
      fielddata: { districtid: [] }
    });
    // alert(branchname)
    if (!value) return;
    let fielddata = { districtid: [] }
    const url = `/api/dropdown/group/${value}/location?locationType=GENERAL`;

    api.get(url).then((res) => {
      console.log('Response Datas:', res?.data);
      if (res?.data) {
        fielddata.districtid = res.data
        updateState({ fielddata });
      }
    });
  };

  const handleSelectedDistrict = (selectedValue) => {
    const selectedItem = state?.fielddata?.districtid?.find(
      (item) => item.value === selectedValue
    );

    updateState({
      ...state,
      form: {
        ...state.form,
        DestinationDistrict: selectedItem?.text || ""  // Text store hoga
      }
    });
  };




  const handleDeleteImage = (index) => {
    const updatedImages = [...(state.form?.Files || [])];
    updatedImages.splice(index, 1);
    updateState({
      ...state,
      form: {
        ...state.form,
        Files: updatedImages
      }
    });
  };


  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission granted');
          openCamera();
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      openCamera(); // iOS me direct open
    }
  };

  const openCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: false,
        cameraType: 'back',
        saveToPhotos: true,
        quality: 0.4,
        maxWidth: 700,
        maxHeight: 700,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const capturedImage = response.assets[0];

          const newFile = {
            uri: Platform.OS === 'android'
              ? capturedImage.uri
              : capturedImage.uri.replace('file://', ''),  // iOS mein remove karo, Android mein rehne do
            fileName: capturedImage.fileName || `photo_${Date.now()}.jpg`,
            type: capturedImage.type || 'image/jpeg',
          };

          // Update state using Files key (not images)
          updateState({
            form: {
              ...state.form,
              Files: [...(state.form?.Files || []), newFile],
            },
          });


        }
      }
    );
  };



  const handleNext = (nextStep: number) => {
    // Validation for Step 1

    let result: any;

    if (currentStep === 0) {
      result = validateStepOne(state.form);
    } else if (currentStep === 1) {
      result = validateStepTwo(state.form);
    }

    else if (currentStep === 2) {
      result = validateStepThree(state.form);
    }

    if (!result?.isValid) {

      alert(result.message);

      return;
    }


    updateState({
      ...state,
      hidden: {
        ...state.hidden,
        previousSteps: [...previousSteps, currentStep],
        currentStep: nextStep
      }
    });
  };

  const handlePrevious = () => {
    if (previousSteps.length > 0) {
      const lastStep = previousSteps[previousSteps.length - 1];

      updateState({
        ...state,
        hidden: {
          ...state.hidden,
          previousSteps: previousSteps.slice(0, -1),
          currentStep: lastStep
        }
      });
    }
  };

  const handleDateConfirm = (selectedDate) => {
    setDatePickerVisibility(false);
    if (selectedDate) {
      updateState({
        ...state,
        form: {
          ...state.form,
          date: selectedDate.toISOString()
        }
      });
    }
  };


  const handleGrossWeightChange = (text) => {
    const tare = parseFloat(state.form?.tareWeight) || 0;
    const gross = parseFloat(text) || 0;
    const net = gross - tare;

    updateState({
      ...state,
      form: {
        ...state.form,
        grossWeight: text,
        netWeight: isNaN(net) ? '' : net.toString(),
      },
    });
  };

  const handleTareWeightChange = (text) => {
    const gross = parseFloat(state.form?.grossWeight) || 0;
    const tare = parseFloat(text) || 0;
    const net = gross - tare;

    updateState({
      ...state,
      form: {
        ...state.form,
        tareWeight: text,
        netWeight: isNaN(net) ? '' : net.toString(),
      },
    });
  };

  const handleSubmit = () => {
    let form = { ...state.form };

    // 👇 Use the function directly
    const cform = createFormData(form);

    api.post('/api/healthreport/receive', cform, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        console.log('Submission successful:', response.data);
        alert('Form submitted successfully!');
      })
      .catch(error => {
        console.error('Submission failed:', error.response?.data || error);
        alert('Submission failed. Please check console for details.');
      });
  };



  useEffect(() => {
    if (state.form?.Trucknumber && state.form.Trucknumber.length >= 6) {
      fetchHealthReport(state.form.Trucknumber);
    }
  }, [state.form?.Trucknumber]);

  const fetchHealthReport = async (trucknumber: any) => {
    try {
      const response = await api.get(
        `/api/healthreport?TruckNumber=${trucknumber}&ReportType=DISPATCH`
      );



      if (response.data && response.data.length > 0) {
        const reportId = response.data[0].id; // Pehla report ka ID le rahe hain
        fetchReportDetails(reportId); // ID pass karke details fetch kar rahe hain
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const fetchReportDetails = async (id: any) => {
    try {
      const response = await api.get(`/api/healthreport/${id}`);


      // Pehle reportDetails update karte hain
      updateState({
        ...state,
        fielddata: {
          ...state.fielddata,
          reportDetails: response.data,
        }
      });

      // Ab datastring parse karke form ke fields update karte hain
      if (response.data && response.data.datastring) {
        const parsedData = JSON.parse(response.data.datastring);

        const updatedForm = {
          ...state.fielddata,
          grossWeight: parsedData.GrossWeight?.toString() || '',
          tareWeight: parsedData.TareWeight?.toString() || '',
          netWeight: parsedData.NetWeight?.toString() || '',
          bagCount: parsedData.BagCount?.toString() || '',
          size: parsedData.Size?.toString() || '',
          spoiledOnion: parsedData.SpoiledOnion ?? false,
          spoiledPercent: parsedData.SpoiledPercent ? parsedData.SpoiledPercent.toString() : '0',
          sproutedOnion: parsedData.SproutedOnion ?? false,
          sproutedPercent: parsedData.SproutedPercent ? parsedData.SproutedPercent.toString() : '0',
          blackSmutOnion: parsedData.BlackSmutOnion ?? false,
          blackSmutPercent: parsedData.BlackSmutPercent ? parsedData.BlackSmutPercent.toString() : '0',
          stainingColour: parsedData.StainingColour ?? false,
          stainingColourPercent: parsedData.StainingColourPercent ? parsedData.StainingColourPercent.toString() : '0',
          onionSkin: parsedData.OnionSkin || '',
          onionSkinPercent: parsedData.OnionSkinPercent ? parsedData.OnionSkinPercent.toString() : '0',
          moisture: parsedData.Moisture || '',
          moisturePercent: parsedData.MoisturePercent ? parsedData.MoisturePercent.toString() : '0',
        };

        updateState({
          ...state,
          form: updatedForm,
        });
      }
    } catch (error) {
      console.error("Error fetching report details:", error);
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

          {/* Step 1 - Company, Branch, District Selection */}
          {currentStep === 0 && (
            <View style={styles.onecontainers}>
              {/* Company Picker */}
              <View style={styles.content}>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={state?.form?.companyId}
                    onValueChange={(value) => handleSelectedCompany(value)}
                  >
                    <Picker.Item label="Select Company" value="" />
                    {state?.fielddata?.companyid?.map((x) => (
                      <Picker.Item key={x.value} label={x.text} value={x.value} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Branch Picker */}
              <View style={styles.content}>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={state?.form?.branchvalue}
                    onValueChange={(id) => handleSelectedBranch(id)}
                  >
                    <Picker.Item label="Select Branch" value="" />
                    {state?.fielddata?.branchid?.map((x) => (
                      <Picker.Item key={x.id} label={x.name} value={x.id} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* District Picker */}
              <View style={styles.content}>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={
                      state?.fielddata?.districtid?.find(
                        (item) => item.text === state?.form?.DestinationDistrict
                      )?.value || ""
                    }
                    onValueChange={(value) => handleSelectedDistrict(value)}
                  >
                    <Picker.Item label="Select District" value="" />
                    {state?.fielddata?.districtid?.map((x) => (
                      <Picker.Item key={x.value} label={x.text} value={x.value} />
                    ))}
                  </Picker>

                </View>
              </View>

              <View style={styles.buttoncontent}>
                <TouchableOpacity style={styles.button} onPress={() => handleNext(1)}>
                  <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Step 2 - Basic Information */}
          {currentStep === 1 && (
            <View style={styles.onecontainers}>

              <TextInput
                style={styles.input}
                placeholder={t('Trucknumber')}
                value={state.form?.Trucknumber || ''}
                onChangeText={(text) => {
                  const upperText = text.toUpperCase();
                  updateState({
                    ...state,
                    form: {
                      ...state.form,
                      Trucknumber: upperText,
                    }
                  });
                }}
                autoCapitalize="characters"
                keyboardType="default" // Yeh aap 'keyb' likh rahe the, pura likha
              />

              <TextInput
                style={styles.input}
                placeholder={t('Grossweight')}
                value={state.form?.grossWeight || ''}
                onChangeText={handleGrossWeightChange}
                keyboardType="numeric"
              />

              <TextInput
                style={styles.input}
                placeholder={t('Tareweight')}
                value={state.form?.tareWeight || ''}
                onChangeText={handleTareWeightChange}
                keyboardType="numeric"
              />

              <TextInput
                style={styles.input}
                placeholder={t('Netweight')}
                value={state.form?.netWeight || ''}
                editable={false}
              />







              <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    editable={false}
                    placeholder={t('SelectDate')}
                    value={state.form?.date ? new Date(state.form.date).toLocaleDateString() : ''}
                  />
                </View>
              </TouchableOpacity>

              {isDatePickerVisible && (
                <DateTimePicker
                  value={state.form?.date ? new Date(state.form.date) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => handleDateConfirm(date)}
                  minimumDate={threeMonthsAgo}
                  maximumDate={today}
                />
              )}




              <TextInput
                style={styles.input}
                placeholder={t('Bagcount')}
                value={state.form?.bagCount || ''}
                onChangeText={(text) => updateState({
                  ...state,
                  form: {
                    ...state.form,
                    bagCount: text
                  }
                })}
                keyboardType="numeric"
              />

              <TextInput
                style={styles.input}
                placeholder={t('Size')}
                value={state.form?.size || ''}
                onChangeText={(text) => updateState({
                  ...state,
                  form: {
                    ...state.form,
                    size: text
                  }
                })}
                keyboardType="numeric"
              />


              <View style={styles.buttoncontent}>
                <TouchableOpacity style={styles.button} onPress={handlePrevious}>
                  <Text style={styles.buttonText}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handleNext(2)}>
                  <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {currentStep === 2 && (
            <View style={styles.thirdcontainers}>

              {/* Staining Colour */}
              <View style={styles.switchContainer}>
                <Text style={styles.text}>{t("stainingColor")}</Text>
                <Switch
                  value={state.form?.stainingColour || false}
                  onValueChange={(value) =>
                    updateState({
                      ...state,
                      form: {
                        ...state.form,
                        stainingColour: value,
                        stainingColourPercent: value ? state.form?.stainingColourPercent : ''
                      }
                    })
                  }
                  trackColor={{ false: '#F6A00191', true: '#FF9500' }}
                  thumbColor={state.form?.stainingColour ? 'white' : '#f4f3f4'}
                />
              </View>

              {state.form?.stainingColour && (
                <TextInput
                  style={styles.input}
                  placeholder={t('StainingPercent')}
                  value={state.form?.stainingColourPercent || ''}
                  onChangeText={(text) =>
                    updateState({
                      ...state,
                      form: { ...state.form, stainingColourPercent: text }
                    })
                  }
                  keyboardType="numeric"
                />
              )}

              {/* Black Smut Onion */}
              <View style={styles.switchContainer}>
                <Text style={styles.text}>{t('BlacksmutOnion')}</Text>
                <Switch
                  value={state.form?.blackSmutOnion || false}
                  onValueChange={(value) =>
                    updateState({
                      ...state,
                      form: {
                        ...state.form,
                        blackSmutOnion: value,
                        blackSmutPercent: value ? state.form?.blackSmutPercent : ''
                      }
                    })
                  }
                  trackColor={{ false: '#F6A00191', true: '#FF9500' }}
                  thumbColor={state.form?.blackSmutOnion ? 'white' : '#f4f3f4'}
                />
              </View>

              {state.form?.blackSmutOnion && (
                <TextInput
                  style={styles.input}
                  placeholder={t('BlacksmutOnionpercent')}
                  value={state.form?.blackSmutPercent || ''}
                  onChangeText={(text) =>
                    updateState({
                      ...state,
                      form: { ...state.form, blackSmutPercent: text }
                    })
                  }
                  keyboardType="numeric"
                />
              )}

              {/* Sprouted Onion */}
              <View style={styles.switchContainer}>
                <Text style={styles.text}>{t('SproutedOnion')}</Text>
                <Switch
                  value={state.form?.sproutedOnion || false}
                  onValueChange={(value) =>
                    updateState({
                      ...state,
                      form: {
                        ...state.form,
                        sproutedOnion: value,
                        sproutedPercent: value ? state.form?.sproutedPercent : ''
                      }
                    })
                  }
                  trackColor={{ false: '#F6A00191', true: '#FF9500' }}
                  thumbColor={state.form?.sproutedOnion ? 'white' : '#f4f3f4'}
                />
              </View>

              {state.form?.sproutedOnion && (
                <TextInput
                  style={styles.input}
                  placeholder={t('SproutedOnionpercent')}
                  value={state.form?.sproutedPercent || ''}
                  onChangeText={(text) =>
                    updateState({
                      ...state,
                      form: { ...state.form, sproutedPercent: text }
                    })
                  }
                  keyboardType="numeric"
                />
              )}

              {/* Spoiled Onion */}
              <View style={styles.switchContainer}>
                <Text style={styles.text}>{t('SpoiledOnion')}</Text>
                <Switch
                  value={state.form?.spoiledOnion || false}
                  onValueChange={(value) =>
                    updateState({
                      ...state,
                      form: {
                        ...state.form,
                        spoiledOnion: value,
                        spoiledPercent: value ? state.form?.spoiledPercent : ''
                      }
                    })
                  }
                  trackColor={{ false: '#F6A00191', true: '#FF9500' }}
                  thumbColor={state.form?.spoiledOnion ? 'white' : '#f4f3f4'}
                />
              </View>

              {state.form?.spoiledOnion && (
                <TextInput
                  style={styles.input}
                  placeholder={t('SpoiledOnionpercent')}
                  value={state.form?.spoiledPercent || ''}
                  onChangeText={(text) =>
                    updateState({
                      ...state,
                      form: { ...state.form, spoiledPercent: text }
                    })
                  }
                  keyboardType="numeric"
                />
              )}

              {/* Onion Skin */}
              <View style={styles.switchContainer}>
                <Text style={styles.text}>
                  {t('Onionskin') + ' : ' + (state.form?.onionSkin === 'SINGLE' ? t('Single') : t('Double'))}
                </Text>
                <Switch
                  value={state.form?.onionSkin === "SINGLE"}
                  onValueChange={(value) =>
                    updateState({
                      ...state,
                      form: {
                        ...state.form,
                        onionSkin: value ? 'SINGLE' : 'DOUBLE',
                        onionSkinPercent: value ? state.form?.onionSkinPercent : ''
                      }
                    })
                  }
                  trackColor={{ false: '#F6A00191', true: '#FF9500' }}
                  thumbColor={state.form?.onionSkin === "SINGLE" ? "white" : "#f4f3f4"}
                />
              </View>

              {state.form?.onionSkin === "SINGLE" && (
                <TextInput
                  style={styles.input}
                  placeholder={t('Onionskinsinglepercent')}
                  value={state.form?.onionSkinPercent || ''}
                  onChangeText={(text) =>
                    updateState({
                      ...state,
                      form: { ...state.form, onionSkinPercent: text }
                    })
                  }
                  keyboardType="numeric"
                />
              )}


              {/* Moisture */}
              <View style={styles.switchContainer}>
                <Text style={styles.text}>
                  {t('Moisture') + ' : ' + (state.form?.moisture === 'WET' ? t('Wet') : t('Dry'))}
                </Text>
                <Switch
                  value={state.form?.moisture === "WET"}
                  onValueChange={(value) =>
                    updateState({
                      ...state,
                      form: {
                        ...state.form,
                        moisture: value ? 'WET' : 'DRY',
                        moisturePercent: value ? state.form?.moisturePercent : ''
                      }
                    })
                  }
                  trackColor={{ false: '#F6A00191', true: '#FF9500' }}
                  thumbColor={state.form?.moisture === "WET" ? "white" : "#f4f3f4"}
                />
              </View>

              {state.form?.moisture === "WET" && (
                <TextInput
                  style={styles.input}
                  placeholder={t('Moisturewetpercent')}
                  value={state.form?.moisturePercent || ''}
                  onChangeText={(text) =>
                    updateState({
                      ...state,
                      form: { ...state.form, moisturePercent: text }
                    })
                  }
                  keyboardType="numeric"
                />
              )}

              {/* Spoiled Switch and Percent */}
              <View>
                <Text style={styles.text}>{t('Spoiled')}</Text>
                <Switch
                  value={state.form?.isSpoiledPercentVisible || false}
                  onValueChange={(value) =>
                    updateState({
                      ...state,
                      form: { ...state.form, isSpoiledPercentVisible: value }
                    })
                  }
                  trackColor={{ false: '#F6A00191', true: '#FF9500' }}
                  thumbColor={state.form?.isSpoiledPercentVisible ? "white" : "#f4f3f4"}
                />
              </View>

              {state.form?.isSpoiledPercentVisible && (
                <TextInput
                  style={styles.input}
                  placeholder={t('spoiledperecent')}
                  value={state.form?.SpoliedPercent || ''}
                  onChangeText={(text) =>
                    updateState({
                      ...state,
                      form: { ...state.form, SpoliedPercent: text }
                    })
                  }
                  keyboardType="numeric"
                />
              )}

              {/* Comments and Branch person name */}
              <TextInput
                style={styles.input}
                placeholder={t('typecomment')}
                value={state.form?.SpoliedComment || ''}
                onChangeText={(text) =>
                  updateState({
                    ...state,
                    form: { ...state.form, SpoliedComment: text }
                  })
                }
              />

              <TextInput
                style={styles.input}
                placeholder={t('branchpersonname')}
                value={state.form?.SpoliedBranch || ''}
                onChangeText={(text) =>
                  updateState({
                    ...state,
                    form: { ...state.form, SpoliedBranch: text }
                  })
                }
              />

              {/* Navigation Buttons */}
              <View style={styles.buttoncontent}>
                <TouchableOpacity style={styles.button} onPress={handlePrevious}>
                  <Text style={styles.buttonText}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handleNext(3)}>
                  <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
              </View>

            </View>
          )}


          {/* Step 4 - Review and Submit */}
          {currentStep === 3 && (
            <View style={{ flex: 1, padding: 20 }}>
              {/* Camera Button */}
              <View style={styles.buttoncontent}>
                <TouchableOpacity style={styles.button} onPress={requestCameraPermission}>
                  <MaterialIcons name="camera" size={30} color="white" />
                  <Text style={styles.buttonText}>{t('PickfromCamera')}</Text>
                </TouchableOpacity>
              </View>

              {/* Previous and Submit Buttons */}
              <View style={styles.buttoncontent}>
                <TouchableOpacity style={styles.button} onPress={handlePrevious}>
                  <Text style={styles.buttonText}>{t('Previous')}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>{t('submit')}</Text>
                </TouchableOpacity>
              </View>

              {/* Image Grid */}
              <View style={styles.imageGrid}>
                {(state.form?.Files || []).map((item, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <TouchableOpacity onPress={() => setSelectedImage(item.uri)}>
                      <Image source={{ uri: item.uri }} style={styles.image} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteIcon}
                      onPress={() => handleDeleteImage(index)}
                    >
                      <MaterialIcons name="cancel" size={24} color="red" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* Modal to show full image */}
              <Modal visible={!!selectedImage} transparent={true}>
                <View style={styles.modalContainer}>
                  <TouchableOpacity
                    style={styles.modalClose}
                    onPress={() => setSelectedImage(null)}
                  >
                    <MaterialIcons name="cancel" size={30} color="white" />
                  </TouchableOpacity>

                  <Image source={{ uri: selectedImage }} style={styles.fullImage} />
                </View>
              </Modal>
            </View>
          )}




        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default TestForm;