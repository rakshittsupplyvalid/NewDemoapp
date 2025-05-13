import React, { useRef, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/Naviagtion/StackNavigator';
import { NavigationContainerRef } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';

type RootParamList = {};

export const NavigationContext = React.createContext<NavigationContainerRef<RootParamList> | null>(null);

const App = () => {
  const navigationRef = useRef<NavigationContainerRef<RootParamList> | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Keep splash screen visible
        await SplashScreen.preventAutoHideAsync();

        // Simulate loading stuff (API calls, fonts, etc)
        await new Promise(resolve => setTimeout(resolve, 2000)); // mock loading

        if (navigationRef.current) {
          setIsReady(true);
        } else {
          setIsReady(true); // fallback if ref is not needed for splash
        }
      } catch (e) {
        console.warn(e);
      } finally {
        // Hide the splash screen when ready
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isReady) return null;

  return (
    <NavigationContainer ref={navigationRef}>
      <NavigationContext.Provider value={navigationRef.current}>
        <StackNavigator />
      </NavigationContext.Provider>
    </NavigationContainer>
  );
};

export default App;
