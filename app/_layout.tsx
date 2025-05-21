import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native'; // <<<--- LISÄÄ TÄMÄ
import { useFrameworkReady } from '@/../hooks/useFrameworkReady';
import { AppProvider } from '@/../context/AppContext';
import * as NavigationBar from 'expo-navigation-bar';
import GroupHeader from '@/../components/common/GroupHeader'; //

function AppContent() {
  return (
    // Käytä View-elementtiä hallitsemaan headerin ja Stackin asettelua
    <View className="flex-1 bg-background">
      <GroupHeader />
      <View className="flex-1">
        {/* Stack vie lopun tilan headerin alapuolella */}
        <Stack screenOptions={{ headerShown: false }} initialRouteName="login" />
      </View>
      {/* StatusBar voi pysyä tässä, sen asetukset vaikuttavat koko sovellukseen */}
      <StatusBar style="dark" hidden={true} translucent={true} backgroundColor="transparent" />
    </View>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {

    NavigationBar.setVisibilityAsync("hidden");
    NavigationBar.setBehaviorAsync('inset-swipe');
  }, []);

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
