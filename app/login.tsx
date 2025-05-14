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
  type SignInResponse,
} from '@react-native-google-signin/google-signin'
import GoogleLogo from '../assets/images/google-logo.png'

export default function LoginScreen() {
  const router = useRouter()
  const [initializing, setInitializing] = useState(true)
  const [loading, setLoading] = useState(false)

  // Your Google OAuth web client ID
  const webClientId =
    '906100274130-e0cduqt9ab0te4kq1iujofiabqtb43ar.apps.googleusercontent.com'

  useEffect(() => {
    // Configure GoogleSignin
    GoogleSignin.configure({
      webClientId,
      offlineAccess: false,
    })
    setInitializing(false)
  }, [])

  async function signInAsync() {
    setLoading(true)
    try {
      // Check Play Services (Android)
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      // Start sign-in (SignInResponse sisältää tokenit)
      const userInfo: SignInResponse = await GoogleSignin.signIn()
      // userInfo.idToken, userInfo.accessToken jne.
      router.replace('/')
    } catch (err: any) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Google sign in cancelled')
      } else if (err.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in already in progress')
      } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.error('Play services not available or outdated')
      } else {
        console.error('GoogleSignin error:', err)
      }
    } finally {
      setLoading(false)
    }
  }

  if (initializing) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="mt-2">Initializing Google Sign-In…</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center p-4">
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