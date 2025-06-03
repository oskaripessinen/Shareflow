import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { supabase } from '../utils/supabase';
import { router } from 'expo-router';

export const signOut = async () => {
  try {
    await GoogleSignin.signOut();
    console.log('Google sign out successful');

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Supabase sign out error:', error);
    } else {
      console.log('Supabase sign out successful');
    }
    router.push('/login');
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error };
  }
};
