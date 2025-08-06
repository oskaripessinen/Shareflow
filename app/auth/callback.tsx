import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../../utils/supabase';
import {  Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          router.replace('/login');
          return;
        }

        if (session) {
          console.log('Authentication successful');
        } else {
          console.log('No session found');
          router.replace('/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.replace('/login');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="mt-4 text-slate-600">Signing you in...</Text>
    </SafeAreaView>
  );
}