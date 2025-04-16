import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, TextInput, TouchableOpacity, Image, StatusBar, ImageBackground, Keyboard, Switch, Button } from 'react-native';
import { Text } from 'react-native-elements';
import api from '../service/api/apiInterceptors';
import { mmkvStorage } from '../service/storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { screenWidth } from '../utils/Constants';
import NetInfo from "@react-native-community/netinfo";
import {useTranslation} from 'react-i18next';



interface LoginAppProps {
  navigation: StackNavigationProp<any>;
}

const LoginApp: React.FC<LoginAppProps> = ({ navigation }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [mobileno, setMobileno] = useState('9990665359');
  const [password, setPassword] = useState('Onion@2025');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { t ,  i18n } = useTranslation();
  const isOffline = !isConnected;
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (!mobileno || !password) {
      Alert.alert('Error', 'Please enter both mobile number and password.');
      return;
    }
  
    if (mobileno.length !== 10 || isNaN(Number(mobileno))) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number.');
      return;
    }
  
    // Check internet connection
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      Alert.alert('No Internet', 'Please check your internet connection and try again.');
      return;
    }
  
    setIsLoading(true);
  
    try {
      const response = await api.post('/api/login/assayer', { mobileno, password });
  
      if (response.status === 200) {
        const responseData = response.data;
  
        mmkvStorage.setItem('userinfo', JSON.stringify(responseData));
        mmkvStorage.setItem('token', responseData.token);
  
        setIsLoading(false);
        navigation.navigate('DispatchDrawernavigator');
      } else {
        setIsLoading(false);
        Alert.alert('Login Failed', response.data.message || 'Invalid credentials.');
      }
    } 

    
    
    catch (error: any) {
      setIsLoading(false);
   
    
      if (error.response && error.response.status === 400) {
        const message = error.response.data?.message || 'Invalid username or password.';
        Alert.alert(
          'Login Failed',
          message,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert( 'Login Failed', "Password might be incorect");
     
      }
    }
  };
  

  const handleNavigation = () => {
    if (isOffline) {
      navigation.navigate('DispatchDrawernavigator'); // Directly navigate in Offline mode
    } else {
      handleLogin(); // Login ke baad navigate
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#F6A001" barStyle="light-content" />
      <View style={styles.phototcontainer}>
        <Image source={require('../assets/Ellipse7.png')} style={styles.topRightImage} />
      </View>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <View style={styles.TextContainer}>
    

          <Text style={styles.logoText}>{t('loginTitle')}</Text>
          <Text style={styles.logoTextinner}>{t('loginSubtitle')}</Text>
        </View>

      </View>




      <ImageBackground
        source={require('../assets/Ellipse8.png')}
        style={styles.inputBackground}
        resizeMode="contain"
      >


        <View style={styles.inputContainer}>
          <Icon name="phone" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder={t('mobilePlaceholder')}
            keyboardType="number-pad"
            autoCapitalize="none"
            value={isOffline ? '' : mobileno}
            onChangeText={setMobileno}
            maxLength={10}
            editable={!isOffline} // Disable input when offline
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder={t('passwordPlaceholder')}
            secureTextEntry={!passwordVisible}
            value={isOffline ? '' : password}
            onChangeText={setPassword}
            editable={!isOffline} 
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Icon name={passwordVisible ? 'eye-off' : 'eye'} size={20} color="#666" />
          </TouchableOpacity>
        </View>


        <View style={{ alignItems: 'flex-end', width: '100%', paddingHorizontal: 20 }}>
          <TouchableOpacity  onPress={() => navigation.navigate('ForgetPassword', { mobileno })}>
            <Text style={styles.footerText}>{t('forgotPassword')}</Text>
          </TouchableOpacity>
        </View>


        {/* <View style={{ alignItems: 'flex-end', width: '100%', paddingHorizontal: 20 }}>
          <TouchableOpacity onPress={() => navigation.navigate('OfflineForm')}>
            <Text style={styles.footerText}>Offline Form</Text>
          </TouchableOpacity>
        </View> */}
{/* 
        <Button title="Hindi" onPress={() => i18n.changeLanguage('hi')} />
<Button title="English" onPress={() => i18n.changeLanguage('en')} /> */}


      </ImageBackground>


      <View style={styles.view}>
        <TouchableOpacity style={styles.button} onPress={handleNavigation}>
        <Text style={styles.buttonText}>{isOffline ? t('offlineButton') : t('loginButton')}</Text>

        </TouchableOpacity>


      </View>

      {/* Conditionally render the image when keyboard is not visible */}
      {!keyboardVisible && (
        <View style={styles.photobottomtcontainer}>
          <Image source={require('../assets/Ellipse9.png')} style={styles.bottomLeftImage} />
        </View>
      )}

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },

  phototcontainer: {
    width: 80,
    height: 80,
    position: 'absolute',
    top: 0,
    right: 0,
  },

  topRightImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 80,
    height: 70,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: -50,
    marginLeft: -170,
  },

  logo: {
    width: screenWidth * 0.5,
    height: screenWidth * 0.2,
    resizeMode: 'contain',

  },
  TextContainer: {
    width: screenWidth * 0.9,
    height: screenWidth * 0.2,

    paddingLeft: 90,

    position: 'relative',
    top: 30,



  },
  logoText: {
    fontSize: 20,

    color: '#333',

  },
  logoTextinner: {
    fontSize: 15,

    color: '#333',



  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F6A001',
    borderRadius: 28,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: '100%',
    backgroundColor: '#ffffff',
    elevation: 14,
  },
  input: {
    flex: 1,
    height: 50,
    padding: 10,
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
  },

  button: {
    width: '70%',
    height: 50,
    backgroundColor: '#F6A001',
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },

  view: {
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -70,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  footerText: {
    marginTop: 15,
    color: 'red',
    fontSize: 14,
  },

  bottomLeftImage: {
    position: 'absolute',
    bottom: 1,
    left: '50%',
    transform: [{ translateX: -35 }],
  },

  photobottomtcontainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 25,
    height: 25,
    backgroundColor: '#F79B0099', // Orange color
    borderBottomLeftRadius: 10,


  },

  inputBackground: {
    width: '100%',
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlinecontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',

    position: 'relative',
    left: 100,
    bottom: 140

  },
  text: {
    fontSize: 18,

    color: '#333',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  }
});

export default LoginApp;
