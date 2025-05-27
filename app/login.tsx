import { useEffect, useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { supabase } from '../utils/supabase';
import { useRouter } from 'expo-router';
import { SafeAreaView, View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { validateToken } from '../api/validateToken';

import GoogleLogo from '../assets/images/google-logo.png';

export const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;
export const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;

console.log(WEB_CLIENT_ID);
console.log(IOS_CLIENT_ID);

export default function LoginScreen() {
  const router = useRouter();
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🔄 Forcing logout for testing...');
        await GoogleSignin.signOut();
        await supabase.auth.signOut();
        console.log('Testing logout completed');
      } catch (error) {
        console.log('Testing logout error (might be already logged out):', error);
      }

      GoogleSignin.configure({
        webClientId: WEB_CLIENT_ID,
        offlineAccess: true,
        forceCodeForRefreshToken: true,
        profileImageSize: 120,
        iosClientId: IOS_CLIENT_ID,
      });
      console.log('GoogleSignin configured with webClientId:', WEB_CLIENT_ID);

      // Poistettu session tarkistus, koska pakotamme aina logout
      setInitializing(false);
    };

    initializeApp();

    // Auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        console.log('Auth state changed, session active.');
      } else {
        console.log('Auth state changed, no session.');
        setInitializing(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

  async function signInAsync() {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const { idToken } = await GoogleSignin.getTokens();
      console.log('Google sign-in successful, ID Token:', idToken);

      console.log('Validating token with backend...');
      const validationResult = await validateToken(idToken);
      console.log('Validation result:', validationResult);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });
      if (authError) throw authError;

      if (user) {
        const { error: upsertError } = await supabase.from('users').upsert(
          {
            google_id: user.id,
            email: user.email,
            full_name: user.user_metadata.full_name,
            avatar_url: user.user_metadata.avatar_url,
          },
          {
            onConflict: 'google_id',
          },
        );
        if (upsertError) console.warn('Could not upsert user:', upsertError);
      }

      router.replace('/create_group');
    } catch (e: unknown) {
      console.error('Kirjautumisvirhe:', e);
    } finally {
      setLoading(false);
    }
  }

  if (initializing) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text>Initializing…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4 justify-center items-center">
      <Text className="text-3xl font-bold mb-8">ShareFlow</Text>

      <TouchableOpacity
        disabled={loading}
        onPress={signInAsync}
        className="flex-row items-center bg-white px-6 py-3 rounded-full shadow"
      >
        <Image source={GoogleLogo} style={{ width: 24, height: 24, marginRight: 12 }} />
        <Text className="text-base font-medium">
          {loading ? 'Signing in…' : 'Sign in with Google'}
        </Text>
      </TouchableOpacity>

      {loading && (
        <View className="mt-4">
          <ActivityIndicator size="small" color="#0891b2" />
          <Text className="text-sm text-slate-500 mt-2">Loading…</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
