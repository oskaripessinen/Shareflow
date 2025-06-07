import { useEffect, useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { supabase } from '../utils/supabase';
import { useRouter } from 'expo-router';
import { SafeAreaView, View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { validateToken } from '../api/validateToken';
import { useAuth, useGroups } from '../context/AppContext';
import { groupApi } from 'api/groups';

import GoogleLogo from '../assets/images/google-logo.png';

export const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;
export const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;

export default function LoginScreen() {
  const router = useRouter();
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const { setGoogleId } = useAuth();
  const { setUserGroups } = useGroups();

  useEffect(() => {
    const initializeApp = async () => {
      GoogleSignin.configure({
        webClientId: WEB_CLIENT_ID,
        offlineAccess: true,
        forceCodeForRefreshToken: true,
        profileImageSize: 120,
        iosClientId: IOS_CLIENT_ID,
      });
      console.log('GoogleSignin configured with webClientId:', WEB_CLIENT_ID);

      const checkSession = async () => {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (session && session.user) {
            const userGroups = await groupApi.getUserGroups();
            console.log('usergroups length:', userGroups.length);
            setUserGroups(userGroups);
            if (userGroups.length > 0) {
              router.replace('/(tabs)');
            } else {
              router.replace('/create_group');
            }

            return;
          } else {
            console.log('No active session found');
          }
        } catch (error) {
          console.log('Session check error:', error);
        }

        setInitializing(false);
      };

      await checkSession();
    };

    initializeApp();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);

      if (event === 'SIGNED_IN' && session) {
        const userGroups = await groupApi.getUserGroups();
        console.log('usergroups length:', userGroups.length);
        setUserGroups(userGroups);
        router.replace('/(tabs)');
      } else if (event === 'SIGNED_OUT') {
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

      await validateToken(idToken);
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (authError) throw authError;

      if (user) {
        setGoogleId(user.id);
        await supabase.from('users').upsert(
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
      }
    } catch (e: unknown) {
      console.error('Login error:', e);
    } finally {
      setLoading(false);
    }
  }

  if (initializing) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-slate-600">Checking authentication...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4 justify-center items-center">
      <Text className="text-3xl font-semibold mb-8">ShareFlow</Text>

      <TouchableOpacity
        disabled={loading}
        onPress={signInAsync}
        className="flex-row items-center bg-white px-6 py-3 rounded-full shadow"
      >
        <Image source={GoogleLogo} style={{ width: 24, height: 24, marginRight: 12 }} />
        <Text className="text-base font-sans">
          {loading ? 'Signing in…' : 'Sign in with Google'}
        </Text>
      </TouchableOpacity>

      <View className="mt-4 h-16 justify-center items-center">
        {loading && (
          <>
            <ActivityIndicator size="small" color="#3B82F6" />
            <Text className="text-sm text-slate-500 mt-2">Authenticating...</Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
