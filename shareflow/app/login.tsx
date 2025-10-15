import { useEffect, useState } from 'react';
const isExpoGo = process.env.EXPO_PUBLIC_IS_EXPO_GO === 'true';
import { supabase } from '../utils/supabase';
import { useRouter } from 'expo-router';
import { SafeAreaView, View, Text, TouchableOpacity, Image, ActivityIndicator, TextInput, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { validateToken } from '../api/validateToken';
import { useAuth, useGroups } from '../context/AppContext';
import { groupApi } from 'api/groups';
import logo from '../assets/images/logo.png';
import GoogleLogo from '../assets/images/google.png';
import AppleLogo from '../assets/images/apple.png';
import { v4 as uuidv4 } from 'uuid';

export const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;
export const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;

type GoogleSigninStatic = typeof import('@react-native-google-signin/google-signin').GoogleSignin;
let GoogleSignin: GoogleSigninStatic | null = null;

const initializeGoogleSignin = async (): Promise<GoogleSigninStatic | null> => {
  if (isExpoGo) {
    console.warn('Google Sign-In not available in Expo Go');
    return null;
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
  
  return GoogleSignin;
};

export default function LoginScreen() {
  const router = useRouter();
  const [initializing, setInitializing] = useState(true);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const { setGoogleId } = useAuth();
  const { setUserGroups } = useGroups();

  useEffect(() => {
    const initializeApp = async () => {
      if (!isExpoGo) {
        await initializeGoogleSignin();
      }

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
        const user = session.user;
        
        try {
          const { data: existingUser } = await supabase
            .from('users')
            .select('google_id, email')
            .eq('email', user.email)
            .single();

          if (existingUser) {
            console.log('Existing user found:', existingUser.email);
            setGoogleId(existingUser.google_id);
          } else {
            const newUuid = uuidv4();
            console.log('Creating new user with UUID:', newUuid);
            
            await supabase.from('users').insert({
              google_id: newUuid,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
              avatar_url: user.user_metadata?.avatar_url,
            });
            
            setGoogleId(newUuid);
          }

          const userGroups = await groupApi.getUserGroups();
          console.log('usergroups length:', userGroups.length);
          setUserGroups(userGroups);
          
          if (userGroups.length > 0) {
            router.replace('/(tabs)');
          } else {
            router.replace('/create_group');
          }
        } catch (error) {
          console.error('User upsert error:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        setInitializing(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);
  
  const sendOTP = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true, 
        },
      });

      if (error) {
        throw error;
      }

      setOtpSent(true);
      Alert.alert(
        'Code Sent', 
        `We've sent a 6-digit code to ${email}. Please check your email and enter the code below.`
      );
    } catch (error) {
      console.error('OTP send error:', error);
    } finally {
      setSending(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    if (otp.length !== 6) {
      Alert.alert('Error', 'Verification code must be 6 digits');
      return;
    }

    setSending(true);
    try {
      const { data: { session }, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'email',
      });

      console.log('OTP verification result:', { 
        user: session?.user?.email, 
        session: !!session, 
        error 
      });

      if (error) {
        throw error;
      }

      if (session) {
        console.log('OTP verification successful');
        setOtpSent(false);
        setOtp('');
      }
    } catch (error) {
      console.error('OTP verify error:', error);
      Alert.alert('Error', 'Invalid verification code');
    } finally {
      setSending(false);
    }
  };

  const resetOTP = () => {
    setOtpSent(false);
    setOtp('');
    setEmail('');
  };

  async function signInAsync() {
    if (isExpoGo) {
      console.warn('Google Sign-In not available in Expo Go');
      return;
    }

    setLoading(true);
    try {
      const gs = await initializeGoogleSignin();
      if (!gs) {
        console.error('Google Sign-In not available');
        return;
      }
      await gs.hasPlayServices();
      await gs.signIn();
      const { idToken } = await gs.getTokens();
      if (!idToken) {
        throw new Error('No idToken from Google Sign-In');
      }

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

      <TextInput 
        className='rounded-full bg-white w-[90%] py-4 px-5 mb-4 text-default border border-slate-200' 
        placeholderTextColor={'grey'} 
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!sending}
      />
      
      <TouchableOpacity 
        className={`flex-row items-center px-6 py-3 rounded-full bg-primary w-[90%] justify-center border border-slate-200 ${
          sending ? 'opacity-50' : ''
        }`}
        onPress={sendOTP}
        disabled={sending}
      >
        {sending ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text className='text-base text-white font-semibold'>
            Send verification code
          </Text>
        )}
      </TouchableOpacity>

      <View className='flex-row justify-center items-center gap-2 my-5 mx-5'>
        <View className='flex-1 h-px bg-slate-300'/>
        <Text className="text-slate-500 font-semibold px-2">or</Text>
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
          Continue with Google
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center bg-white px-6 py-3 rounded-full w-[90%] justify-center mt-4 active:bg-slate-100 border border-slate-200">
        <Image source={AppleLogo} style={{ width: 24, height: 24, marginRight: 12 }} />
        <Text className="text-base text-default font-semibold">Continue with Apple</Text>
      </TouchableOpacity>

      <View className="mt-4 h-16 justify-center items-center">
        {loading && (
          <ActivityIndicator size="small" color="#3B82F6" />
        )}
      </View>

      <Modal
        isVisible={otpSent}
        onBackdropPress={resetOTP}
        onBackButtonPress={resetOTP}
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={{ margin: 0 }}
        hideModalContentWhileAnimating={true}
        avoidKeyboard={true}
      >
        <View className="flex-1 bg-white">
          <SafeAreaView className="flex-1">
            <View className="flex-row items-center justify-between px-6 py-4">
              <TouchableOpacity 
                onPress={resetOTP}
                className="p-2"
              >
                <Text className="text-slate-500 text-base">Cancel</Text>
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-default">Enter Code</Text>
              <View className="w-16" />
            </View>

            <View className="flex-1 justify-center items-center px-6">
              <Text className="text-slate-600 text-center mb-8 text-base">
                Enter the 6-digit code sent to {email}
              </Text>

              <TextInput 
                className='rounded-xl bg-slate-50 w-full py-6 px-4 mb-8 text-default border border-slate-200 text-center text-2xl tracking-[8px] font-semibold' 
                placeholderTextColor={'#94a3b8'} 
                placeholder='000000'
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                maxLength={6}
                editable={!sending}
                autoFocus={true}
                selectionColor="#3B82F6"
              />

              <TouchableOpacity 
                className={`flex-row items-center px-6 py-4 rounded-xl bg-primary w-full justify-center mb-6 ${
                  sending || otp.length !== 6 ? 'opacity-50' : ''
                }`}
                onPress={verifyOTP}
                disabled={sending || otp.length !== 6}
              >
                {sending ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className='text-lg text-white font-semibold'>
                    Verify
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={sendOTP}
                disabled={sending}
              >
                <Text className="text-slate-500 text-base">
                  Resend code
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
