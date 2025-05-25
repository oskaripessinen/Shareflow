import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { useRouter } from 'expo-router';
import { Users, X } from 'lucide-react-native';

export default function CreateGroupScreen() {
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitees, setInvitees] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEmailInputFocused, setIsEmailInputFocused] = useState(false); 


  const handleAddInvitee = () => {
    if (!inviteEmail.trim()) {
      return;
    }

    if (!/\S+@\S+\.\S+/.test(inviteEmail)) {
      return;
    }
    if (invitees.includes(inviteEmail.trim().toLowerCase())) {
      return;
    }
    setInvitees([...invitees, inviteEmail.trim().toLowerCase()]);
    setInviteEmail('');
  };

  const handleRemoveInvitee = (emailToRemove: string) => {
    setInvitees(invitees.filter((email) => email !== emailToRemove));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      return;
    }
    setLoading(true);
    try {
      console.log('Group created:', groupName, 'with invitees:', invitees);

      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-5 items-center">
            <View className='mb-5 flex items-center justify-center'>
              <Users size={60} color="#3B82F6" />
            </View>
            <View className="flex-row items-center justify-center mb-2">
              <Text className="text-3xl font-bold text-slate-800 text-center mr-4">
                Create a New Group
              </Text>
            </View>
            <Text className="text-sm text-slate-600 text-center mb-14">
              Enter the group name and optionally invite members.
            </Text>

            <View className="mb-6 w-full max-w-md">
              <TextInput
                className="border border-slate-300 rounded-xl px-4 py-3 text-base text-gray-900 placeholder:text-slate-500"
                placeholder="Group Name"
                value={groupName}
                onChangeText={setGroupName}
                autoCapitalize="sentences"
              />
            </View>

            <View className="mb-6 w-full max-w-md">
              <View className="relative">
                <TextInput
                  className="bg-background border border-slate-300 rounded-xl px-4 py-3 pr-12 text-base text-slate-900 placeholder-slate-400 placeholder:text-slate-500"
                  placeholder="Invite with email (optional)"
                  value={inviteEmail}
                  onChangeText={setInviteEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setIsEmailInputFocused(true)}
                  onBlur={() => setIsEmailInputFocused(false)}
                />
                
                <TouchableOpacity
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                  onPress={handleAddInvitee}
                  disabled={loading || !inviteEmail.trim()}
                >
                  {isEmailInputFocused && (
                  <View className="p-1">
                    <Text className={`p-1 ${
                    loading || !inviteEmail.trim() ? 'text-slate-300' : 'text-[#3B82F6] font-semibold'
                  }`}>Add</Text>
                  </View>)}
                </TouchableOpacity>
              </View>
            </View>

            {invitees.length > 0 && (
              <View className="mb-6 w-full max-w-md">
                {invitees.map((email, index) => (
                  <View
                    key={index}
                    className="flex-row items-center justify-between bg-white p-3 rounded-xl border border-slate-200 mb-2"
                  >
                    <Text className="text-slate-700">{email}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveInvitee(email)}
                      disabled={loading}
                      className="p-1"
                    >
                      <X size={15} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>


        <View className="px-5 my-10 border-slate-200 bg-background jutify-start">
          <View className="w-full max-w-md mx-auto justify-start">
            <TouchableOpacity
              className={`py-4 rounded-xl items-center justify-start shadow-md ${
                loading || !groupName.trim() ? 'bg-slate-400' : 'bg-primary active:bg-cyan-700'
              }`}
              onPress={handleCreateGroup}
              disabled={loading || !groupName.trim()}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-base font-semibold">Create Group</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
