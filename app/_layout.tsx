import '../global.css';
import { Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useFrameworkReady } from '@/../hooks/useFrameworkReady';
import { AppProvider } from '@/../context/AppContext';
import GroupHeader from '@/../components/common/GroupHeader';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';


SplashScreen.preventAutoHideAsync();

function AppContent() {
  const segments = useSegments() as string[];
  const showGroupHeader = segments.includes('(tabs)');


  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);


  if (!fontsLoaded) {
    return null;
  }

  return (
    <View className="flex-1 bg-background">
      {showGroupHeader && <GroupHeader />}
      <View className="flex-1">
        <Stack screenOptions={{ headerShown: false }} initialRouteName="login" />
      </View>
      <StatusBar style="dark" translucent={true} backgroundColor="transparent" />
    </View>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
