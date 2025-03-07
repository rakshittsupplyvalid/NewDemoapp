import React, { useState } from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import LoginApp from '../MainComponent/LoginApp';
import Federation from '../MainComponent/Federation';




import Navbar from '../App/Navbar';

import SwitchScreens from '../MainComponent/SwitchScreens';
import DispatchDrawernavigator from './DispatchDrawernavigator';
import DispatchRecieve from '../Screenthree/DispatchRecieve';

import HealthReport from '../Screenthree/HealthReport';
import ForgetPassword from '../MainComponent/ForgetPassword';



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


      <Stack.Screen name="DispatchRecieve" component={DispatchRecieve} />
      
      <Stack.Screen name="Federation" component={Federation} />

      <Stack.Screen name="Navbar" component={Navbar} />
      <Stack.Screen name=" SwitchScreens" component={SwitchScreens} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="HealthReport" component={HealthReport} />
    
    </Stack.Navigator>

  );
}



