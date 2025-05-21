import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/../hooks/useFrameworkReady';
import { AppProvider } from '@/../context/AppContext';


function AppContent() {

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} initialRouteName="login" />
      <StatusBar style="dark" translucent={true} backgroundColor='transparent' />
    </>
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
