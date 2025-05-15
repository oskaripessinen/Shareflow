import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native'
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin'

import GoogleLogo from '../assets/images/google-logo.png'

/** OAuth-web-client ID */
export const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;
/** OAuth-iOS-client ID */
export const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;

export default function LoginScreen() {
  const router = useRouter()
  const [initializing, setInitializing] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      profileImageSize: 120,
      iosClientId: IOS_CLIENT_ID,
    })
    setInitializing(false)
    console.log('GoogleSignin configured with webClientId:', WEB_CLIENT_ID)
  }, [])

  async function signInAsync() {
    setLoading(true)
    
    await GoogleSignin.hasPlayServices();
    console.log('Google Play Services are available')
    const SignInResponse = await GoogleSignin.signIn();
    console.log('User Info:', SignInResponse);
    router.push('/(tabs)')
    
  }

  if (initializing) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text>Initializing…</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 p-4 justify-center items-center">
      <Text className="text-3xl font-bold mb-8">ShareFlow</Text>

      <TouchableOpacity
        disabled={loading}
        onPress={signInAsync}
        className="flex-row items-center bg-white px-6 py-3 rounded-full shadow"
      >
        <Image
          source={GoogleLogo}
          style={{ width: 24, height: 24, marginRight: 12 }}
        />
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
  )
}