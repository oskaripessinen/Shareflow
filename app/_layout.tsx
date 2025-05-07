import '../global.css'; // For web styling with Tailwind
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/../hooks/useFrameworkReady';
import { AppProvider } from '@/../context/AppContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>
      <StatusBar style="auto" />
    </AppProvider>
  );
}