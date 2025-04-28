import React, { useState } from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import LoginApp from '../Component/LoginApp';

import Federation from '../Component/ReportOffline';
import Navbar from '../../App/Navbar';
import DispatchDrawernavigator from './DispatchDrawernavigator';
import DispatchRecieve from '../../src/Component/DispatchRecieve';
import ReimbursementList from '../../src/Component/ReimbursementList';
import HealthReport from '../../src/Component/HealthReport';
import ForgetPassword from '../Component/ForgetPassword';
import OfflineForm from '../../src/Component/OfflineForm';
import ReportOffline from '../Component/ReportOffline';
import SubmitTruckData from '../../src/Component/SubmitTruckData';
import LanguageSelector from '../../src/Component/Languages';



const Stack = createStackNavigator();

export default function StackNavigator() {


  return (

    <Stack.Navigator
      id={undefined}
      initialRouteName={'LoginApp'}
      screenOptions={{ headerShown: false }}

    >
      <Stack.Screen name="LoginApp" component={LoginApp} />
      <Stack.Screen name="DispatchDrawernavigator" component={DispatchDrawernavigator} />
      <Stack.Screen name="ReportOffline" component={ReportOffline} />
      <Stack.Screen name="DispatchRecieve" component={DispatchRecieve} />
      <Stack.Screen name="Federation" component={Federation} />
      <Stack.Screen name="Navbar" component={Navbar} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="HealthReport" component={HealthReport} />
      <Stack.Screen name="ReimbursementList" component={ReimbursementList} />
      <Stack.Screen name = "OfflineForm" component={OfflineForm} />
      <Stack.Screen name = "SubmitTruckData" component={SubmitTruckData} />
      <Stack.Screen name = "LanguageSelector" component={LanguageSelector} />
    
    
    </Stack.Navigator>

  );
}



