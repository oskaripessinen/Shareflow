import { supabase } from '../utils/supabase';
import { router } from 'expo-router';
import { useAppStore, useGroupStore } from '../context/AppContext';

const isExpoGo = process.env.EXPO_PUBLIC_IS_EXPO_GO === 'true';

type GoogleSigninStatic = typeof import('@react-native-google-signin/google-signin').GoogleSignin;
let GoogleSignin: GoogleSigninStatic | null = null;

const initializeGoogleSignin = async (): Promise<GoogleSigninStatic | null> => {
  if (isExpoGo) {
    console.warn('Google Sign-In not available in Expo Go');
    return null;
  }
  if (!GoogleSignin) {
    try {
      const module = await import('@react-native-google-signin/google-signin');
      GoogleSignin = module.GoogleSignin as GoogleSigninStatic;
      console.log('GoogleSignin module loaded for sign out');
    } catch (error) {
      console.error('Failed to import GoogleSignin:', error);
      return null;
    }
  }
  return GoogleSignin;
};

export const signOut = async () => {
  try {
    if (!isExpoGo) {
      const gs = await initializeGoogleSignin();
      if (gs) {
        await gs.signOut();
        console.log('Google sign out successful');
      } else {
        console.log('Google Sign-In not available, skipping Google sign out');
      }
    } else {
      console.log('Expo Go detected, skipping Google sign out');
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Supabase sign out error:', error);
    } else {
      console.log('Supabase sign out successful');
    }
    
    useAppStore.getState().resetState();
    useGroupStore.getState().resetGroupState();

    router.push('/login');
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error };
  }
};
