import { Redirect } from 'expo-router'

export default function Index() {
  // ensimmäiseksi avautuu /login (ts. app/(tabs)/login.tsx)
  return <Redirect href="/login" />
}