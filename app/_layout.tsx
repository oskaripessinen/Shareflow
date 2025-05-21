import '../global.css';
import { useEffect } from 'react';
import * as SystemUI from 'expo-system-ui';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/../hooks/useFrameworkReady';
import { AppProvider } from '@/../context/AppContext';

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync('white');
  }, []);

  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }} initialRouteName="login" />
      <StatusBar style="auto" />
    </AppProvider>
  );
}
