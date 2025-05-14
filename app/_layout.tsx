import '../global.css'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useFrameworkReady } from '@/../hooks/useFrameworkReady'
import { AppProvider } from '@/../context/AppContext'

export default function RootLayout() {
  useFrameworkReady()

  return (
    <AppProvider>
      <Stack
        screenOptions={{ headerShown: false }}
        initialRouteName="/(auth)/login"  // Try with a different path format
      />
      <StatusBar style="auto" />
    </AppProvider>
  )
}