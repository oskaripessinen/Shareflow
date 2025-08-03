import { supabase } from '../utils/supabase';
import { router } from 'expo-router';
import { useAppStore, useGroupStore } from '../context/AppContext';

const isExpoGo = process.env.EXPO_PUBLIC_IS_EXPO_GO === 'true';


let GoogleSignin: any = null;

const initializeGoogleSignin = async (): Promise<boolean> => {
  if (isExpoGo) {
    console.warn('Google Sign-In not available in Expo Go');
    return false;
  }
  
  if (!GoogleSignin) {
    try {
      const module = await import('@react-native-google-signin/google-signin');
      GoogleSignin = module.GoogleSignin;
      console.log('GoogleSignin module loaded for sign out');
    } catch (error) {
      console.error('Failed to import GoogleSignin:', error);
      return false;
    }
  }
  
  return true;
};

export const signOut = async () => {
  try {
    // Try to sign out from Google only if not in Expo Go
    if (!isExpoGo) {
      const isInitialized = await initializeGoogleSignin();
      if (isInitialized && GoogleSignin) {
        await GoogleSignin.signOut();
        console.log('Google sign out successful');
      } else {
        console.log('Google Sign-In not available, skipping Google sign out');
      }
    } else {
      console.log('Expo Go detected, skipping Google sign out');
    }

    // Always sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Supabase sign out error:', error);
    } else {
      console.log('Supabase sign out successful');
    }

    // Reset app state
    useAppStore.getState().resetState();
    useGroupStore.getState().resetGroupState();

    // Navigate to login
    router.push('/login');
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error };
  }
};
