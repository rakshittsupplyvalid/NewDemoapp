import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, TextInput, TouchableOpacity, Image, StatusBar, ImageBackground, Keyboard, Switch } from 'react-native';
import { Text } from 'react-native-elements';
import api from '../service/api/apiInterceptors';
import { mmkvStorage } from '../service/storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { screenWidth } from '../utils/Constants';

interface LoginAppProps {
  navigation: StackNavigationProp<any>;
}

const LoginApp: React.FC<LoginAppProps> = ({ navigation }) => {
  const [mobileno, setMobileno] = useState('9990665359');
  const [password, setPassword] = useState('Onion@2025');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const toggleSwitch = () => setIsOffline(previousState => !previousState);

  const handleLogin = async () => {
    if (!mobileno || !password) {
      Alert.alert('Error', 'Please enter both mobile number and password.');
      return;
    }
    if (mobileno.length !== 10 || isNaN(Number(mobileno))) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.post('/api/login/assayer', { mobileno, password });

      if (response.status === 200) {
        const responseData = response.data;
        mmkvStorage.setItem('userinfo', JSON.stringify(responseData));
        mmkvStorage.setItem('token', responseData?.token);
        navigation.navigate('DispatchDrawernavigator');
      } else {
        Alert.alert('Login Failed', response.data.message || 'Invalid credentials.');
      }
    } catch (error) {

      Alert.alert('Error', 'Password might be incorrect.');
    } finally {
      setIsLoading(false);
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
        <View  style={styles.TextContainer}>

     
<Text style={styles.logoText}>Login into Your Account</Text>
<Text  style={styles.logoTextinner}>See what is going on with your business</Text>
</View>
    
   </View>


 

      <ImageBackground
        source={require('../assets/Ellipse8.png')}
        style={styles.inputBackground}
        resizeMode="contain"
      >

<View style={styles.offlinecontainer}>
      <Text style={styles.text}>Offline Mode</Text>
      <View style={styles.switchContainer}>
        <Switch
          trackColor={{ false: '#d3d3d3', true: '#F79B00' }}
          thumbColor={isOffline ? '#fff' : '#fff'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isOffline}
        />
 
      </View>
    </View>
        
        <View style={styles.inputContainer}>
          <Icon name="phone" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            keyboardType="number-pad"
            autoCapitalize="none"
            value={mobileno}
            onChangeText={setMobileno}
            maxLength={10}
            editable={!isOffline} // Disable input when offline
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
            editable={!isOffline} // Disable input when offline
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Icon name={passwordVisible ? 'eye-off' : 'eye'} size={20} color="#666" />
          </TouchableOpacity>
        </View>

        
        <View style={{ alignItems: 'flex-end', width: '100%', paddingHorizontal: 20 }}>
  <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
    <Text style={styles.footerText}>Forget Password</Text>
  </TouchableOpacity>
</View>



<View style={{ alignItems: 'flex-end', width: '100%', paddingHorizontal: 20 }}>
  <TouchableOpacity onPress={() => navigation.navigate('ReportOffline')}>
    <Text style={styles.footerText}>Report Offline</Text>
  </TouchableOpacity>
</View>


      </ImageBackground>


      <View style={styles.view}>
      <TouchableOpacity style={styles.button} onPress={handleNavigation}>
        <Text style={styles.buttonText}>{isOffline ? 'Offline' : 'Login'}</Text>
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
  
       paddingLeft : 90,
     
        position : 'relative',
        top : 30,
 

 
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
    marginTop: -30,
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
   
    position : 'relative',
    left  : 100,
    bottom : 140
   
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
