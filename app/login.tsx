import { useEffect, useState } from 'react';
const isExpoGo = process.env.EXPO_PUBLIC_IS_EXPO_GO === 'true';
import { supabase } from '../utils/supabase';
import { useRouter } from 'expo-router';
import { SafeAreaView, View, Text, TouchableOpacity, Image, ActivityIndicator, TextInput } from 'react-native';
import { validateToken } from '../api/validateToken';
import { useAuth, useGroups } from '../context/AppContext';
import { groupApi } from 'api/groups';
import logo from '../assets/images/logo.png';
import GoogleLogo from '../assets/images/google.png';
import AppleLogo from '../assets/images/apple.png';

export const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;
export const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;

let GoogleSignin: any = null;

const initializeGoogleSignin = async () => {
  console.log(process.env.EXPO_PUBLIC_IS_EXPO_GO);

  if (isExpoGo) {
    console.warn('Google Sign-In not available in Expo Go');
    return false;
  }
  
  if (!GoogleSignin) {
    const module = await import('@react-native-google-signin/google-signin');
    GoogleSignin = module.GoogleSignin;
    
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      profileImageSize: 120,
      iosClientId: IOS_CLIENT_ID,
    });
    console.log('GoogleSignin configured with webClientId:', WEB_CLIENT_ID);
  }
  
  return true;
};

export default function LoginScreen() {
  const router = useRouter();
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const { setGoogleId } = useAuth();
  const { setUserGroups } = useGroups();

  useEffect(() => {
    const initializeApp = async () => {
      await initializeGoogleSignin();

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
    if (isExpoGo) {
      console.warn('Google Sign-In not available in Expo Go');
      return;
    }

    setLoading(true);
    try {
      const isInitialized = await initializeGoogleSignin();
      if (!isInitialized) {
        console.error('Google Sign-In not available');
        return;
      }

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
    <SafeAreaView className="flex-1 p-4 mt-4 items-center justify-center bg-background">
      <View className='flex-row items-center justify-center gap-1'>
        <Image source={logo} style={{ width: 40, height: 75, left: -5 }} />
        <View className='flex-row items-start'>
          <Text className="text-4xl font-semibold text-default">Share</Text>
          <Text className='text-4xl font-semibold text-primary'>Flow</Text>
        </View>
      </View>
      <Text className="text-sm font-semibold text-slate-500 my-4">
        log in
      </Text>
      <TextInput className='rounded-full bg-white w-[90%] py-3 px-4 mb-4 text-default border border-slate-200' placeholderTextColor={'grey'} placeholder='Email'/>
      <TouchableOpacity className='flex-row items-center px-6 py-3 rounded-full bg-primary w-[90%] justify-center border border-slate-200'>
        <Text className='text-base text-white font-semibold'>
          Send one time password
        </Text>
      </TouchableOpacity>
      <View className='flex-row justify-center items-center gap-2 my-5 mx-5'>
        <View className='flex-1 h-px bg-slate-300'/>
          <Text className="text-slate-500 font-semibold px-2">
            or
          </Text>
        <View className='flex-1 h-px bg-slate-300'/>
    </View>
      <TouchableOpacity
        disabled={loading || isExpoGo}
        onPress={signInAsync}
        className={`flex-row items-center px-6 py-3 rounded-full w-[90%] justify-center border border-slate-200 ${
          isExpoGo ? 'bg-gray-200' : 'bg-white active:bg-slate-100'
        }`}
      >
        <Image source={GoogleLogo} style={{ width: 24, height: 24, marginRight: 12 }} />
        <Text className={`text-base font-semibold ${isExpoGo ? 'text-gray-500' : 'text-default'}`}>
          {'Continue with Google'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex-row items-center bg-white px-6 py-3 rounded-full w-[90%] justify-center mt-4 active:bg-slate-100 border border-slate-200">
        <Image source={AppleLogo} style={{ width: 24, height: 24, marginRight: 12 }} />
        <Text className="text-base text-default font-semibold">Continue with Apple</Text>
      </TouchableOpacity>

      <View className="mt-4 h-16 justify-center items-center">
        {loading && (
          <>
            <ActivityIndicator size="small" color="#3B82F6" />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
