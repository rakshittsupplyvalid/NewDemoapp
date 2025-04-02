import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import GenerateHealthReport from '../Screenthree/GenerateHealthReport';
import HealthReportlist from '../Screenthree/HealthReportlist';
import DispatchReportlist from '../Screenthree/DispatchReportlist';
import RecieveDhasboard from '../Screenthree/RecieveDhasboard';
import Dispatchlist from '../Screenthree/Dispatchlist';
import Recievelist from '../Screenthree/Recievelist';
import ReimbursementForm from '../Screenthree/ReimbursementForm';
import ReimbursementList from '../Screenthree/ReimbursementList';

import { RootStackParamList } from '../types/Type';
import api from '../service/api/apiInterceptors';

const Drawer = createDrawerNavigator<RootStackParamList>();

export default function DispatchDrawernavigator() {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (): Promise<void> => {
    try {
      const response = await api.get('/api/user/profile');
      setProfileData(response.data);

    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Unable to fetch profile data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <Drawer.Navigator
     id={undefined}
      drawerContent={(props) => <CustomDrawerContent {...props} profileData={profileData} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#6200EE' },
        headerTintColor: '#fff',
        drawerStyle: { backgroundColor: '#FFFFFF', width: 290 },
        drawerActiveTintColor: '#6200EE',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: { fontSize: 16, fontWeight: 'bold' },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={RecieveDhasboard}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => <Icon name="dashboard" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Generate Health Report"
        component={GenerateHealthReport}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => <Icon name="health-and-safety" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Health Report List"
        component={HealthReportlist}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => <Icon name="medical-services" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Dispatch Report List"
        component={DispatchReportlist}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => <Icon name="assignment" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Dispatch Truck List"
        component={Dispatchlist}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => <Icon name="local-shipping" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Receive Truck List"
        component={Recievelist}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => <Icon name="move-to-inbox" size={size} color={color} />,
        }}
      />

<Drawer.Screen
        name="ReimbursementForm"
        component={ReimbursementForm}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => <Icon name="attach-money" size={size} color={color} />,
        }}
      />

{/* <Drawer.Screen
        name="ReimbursementList"
        component={ReimbursementList}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => <Icon name="request-quote" size={size} color={color} />,
        }}
      /> */}
    </Drawer.Navigator>
  );
}

function CustomDrawerContent(props: any) {
  const { profileData } = props;

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerFooter}>
        <Image source={require('../assets/profile.jpg')} style={styles.image} />
        <Text style={styles.footerText}>{profileData?.name || 'User Name'}</Text>
     
      </View>

      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerFooter: {
    marginTop: 30,
    padding: 10,
    marginBottom: 40,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});
