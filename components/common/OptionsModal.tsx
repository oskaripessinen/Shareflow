import React, { useState } from 'react';
import { Text, Pressable, View, ActivityIndicator } from 'react-native';
import { X, ChevronRight, UserPlus, Users, LogOut } from 'lucide-react-native';
import { signOut } from 'utils/auth';
import { router } from 'expo-router';

interface OptionsProps {
  onClose: () => void;
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
  handleOpenInviteModal: () => void;
}

const OptionsModal: React.FC<OptionsProps> = ({ onClose, handleOpenInviteModal }) => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const result = await signOut();
    setLoading(false);
    if (result.success) {
      onClose();
    } else {
      console.error('Logout failed:', result.error);
    }
  };

  const handleNewGroup = () => {
    onClose();
    router.push('/create_group');
  };

  return (
    <Pressable className="flex-1 justify-end" onPress={onClose}>
      <Pressable
        className="bg-white rounded-t-2xl pt-4 pb-2 px-0 w-full shadow-lg"
        onPress={(e) => e.stopPropagation()}
      >
        <View className="flex-row justify-between items-center mx-5 pb-2 pt-1">
          <Text className="text-xl font-semibold text-slate-800">Manage</Text>
          <Pressable onPress={onClose} className="p-1">
            <X size={24} color="#64748b" />
          </Pressable>
        </View>

        <View className="w-full items-center">
          <View className="w-full">

            <View className="h-px bg-slate-200 w-full my-2" />

            <Pressable onPress={handleOpenInviteModal} className="flex-row items-center justify-between p-3.5 rounded-lg active:bg-slate-50 w-[90%] mx-auto">
              <View className='flex-row'>
                <UserPlus strokeWidth={1.8} size={22} color="#000000b3"/>
                <Text className="font-base font-medium text-muted ml-3">Invite user</Text>
              </View>
              <ChevronRight strokeWidth={1.8} color="#000000b3"/>
            </Pressable>

            <View className="h-px bg-slate-200 w-[90%] my-2 mx-auto" />

            <Pressable
              onPress={() => handleNewGroup()}
              className="flex-row items-center justify-between p-3.5 rounded-lg active:bg-slate-50 w-[90%] mx-auto"
            >
              <View className='flex-row'>
                <Users strokeWidth={1.8} size={22} color="#000000b3"/>
                <Text className="font-base font-medium text-muted ml-3">New group</Text>
              </View>
              <ChevronRight strokeWidth={1.8} color="#000000b3"/>
            </Pressable>

            <View className="h-px bg-slate-200 w-[90%] my-2 mx-auto" />

            <Pressable
              onPress={() => handleLogout()}
              className="flex-row items-center p-3.5 rounded-lg w-[90%] mx-auto justify-between bg-danger2/5 active:bg-slate-50"
            >
              <View className='flex-row'>
                <LogOut strokeWidth={1.8} size={22} color="#EF4444"/>
                <Text className="font-base font-medium ml-3 text-danger">Log out</Text>
              </View>
              <ChevronRight strokeWidth={1.8} color="#EF4444"/>
            </Pressable>
          </View>
        </View>
      </Pressable>
      {loading && (
        <View
          className="absolute w-full h-full bg-black/50 justify-center items-center"
          style={{ zIndex: 10 }}
        >
          <ActivityIndicator color={'#3B82F6'} size={'large'} />
        </View>
      )}
    </Pressable>
  );
};

export default OptionsModal;
