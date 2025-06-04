import React from 'react';
import { Text, Pressable, View } from 'react-native';
import { LogOut, Users, UserPlus, X } from 'lucide-react-native';
import { signOut } from 'utils/auth';
import { router } from 'expo-router';

interface OptionsProps {
  onClose: () => void;
}

const OptionsModal: React.FC<OptionsProps> = ({ onClose }) => {

  const handleLogout = async () => {
    const result = await signOut();
    if (result.success) {
      onClose();
    } else {
      console.error('Logout failed:', result.error);
    }
  };

  const handleNewGroup = () => {
    onClose();
    router.push('/create_group');
    
  }

  return (
    <Pressable className="flex-1 justify-end" onPress={onClose}>
      <Pressable
        className="bg-white rounded-t-2xl pt-5 pb-8 px-5 w-full shadow-lg"
        onPress={(e) => e.stopPropagation()}
      >
        <View className="flex-row justify-end items-center">
          <Pressable onPress={onClose} className="p-1">
            <X size={24} color="#64748b" />
          </Pressable>
        </View>

        <View className="w-full items-center">
          <View className="w-full">
            <Pressable className="flex-row items-center p-3.5 rounded-lg w-full justify-center active:bg-slate-50">
              <UserPlus size={22} color="black" className="mr-3" />
              <Text className="font-semibold text-slate-700 ml-4">Invite user</Text>
            </Pressable>
            <View className="h-px bg-slate-200 w-full my-2" />
            <Pressable onPress={() => handleNewGroup()} className="flex-row items-center p-3.5 rounded-lg w-full active:bg-slate-50 justify-center">
              <Users size={22} color="black" className="mr-3" />
              <Text className="text-base font-semibold text-slate-700 ml-4">New group</Text>
            </Pressable>
            <View className="h-px bg-slate-200 w-full my-2" />
            <Pressable
              onPress={() => handleLogout()}
              className="flex-row items-center p-3.5 rounded-lg w-full justify-center active:bg-slate-50"
            >
              <LogOut size={22} color="#EF4444" className="mr-3" />
              <Text className="font-semibold ml-4 text-danger">Log Out</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Pressable>
  );
};

export default OptionsModal;
