import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { SafeAreaView, View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import GoogleLogo from '../assets/images/google-logo.png'
import * as Google from 'expo-auth-session/providers/google'
import 'react-native-url-polyfill/auto'

WebBrowser.maybeCompleteAuthSession()

export default function LoginScreen() {
  const router = useRouter()

  // !! VAIHDA 'OMA_EXPO_KAYTTAJANIMI' OIKEAAN EXPO-KÄYTTÄJÄNIMEESI !!
  const expoUsername = 'oskaripessinen'; // Hae komennolla `expo whoami`
  const appSlug = 'bolt-expo-nativewind'; // Varmista tämä app.json tiedostostasi

  const explicitRedirectUri = `https://auth.expo.io/@${expoUsername}/${appSlug}`;
  
  // Tulosta URI konsoliin varmistaaksesi, että se on oikein muodostettu
  console.log("Käytetään redirect URI:", explicitRedirectUri);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '906100274130-j1a4crrqltccgj3kthmau71soro69mgi.apps.googleusercontent.com',
    redirectUri: explicitRedirectUri, // Käytä eksplisiittisesti määritettyä URIa
  })

  useEffect(() => {
    console.log('Response:', response);
    if (response?.type === 'success' && response.authentication) {
      console.log('Response:', response);
      router.replace('/')
    }
  }, [response])

  return (
    <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center p-4">
      <Text className="text-3xl font-bold mb-8">ShareFlow</Text>
      <TouchableOpacity
        disabled={!request}
        onPress={() => promptAsync()}
        className="flex-row items-center bg-white px-6 py-3 rounded-full shadow"
      >
        <Image
          source={GoogleLogo}
          style={{ width: 24, height: 24, marginRight: 12 }}
        />
        <Text className="text-base font-medium">Sign in with Google</Text>
      </TouchableOpacity>
      {!request && (
        <View className="mt-4">
          <ActivityIndicator size="small" color="#0891b2" />
          <Text className="text-sm text-slate-500 mt-2">Loading...</Text>
        </View>
      )}
    </SafeAreaView>
  )
}