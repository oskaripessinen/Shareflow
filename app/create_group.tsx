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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';

export default function CreateGroupScreen() {
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitees, setInvitees] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

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
            <Text className="text-3xl font-bold text-slate-800 text-center mb-2">
              Create a New Group
            </Text>
            <Text className="text-sm text-slate-600 text-center mb-14">
              Enter the group name and optionally invite members.
            </Text>

            <View className="mb-6 w-full max-w-md">
              <TextInput
                className="bg-white border border-slate-300 rounded-xl px-4 py-3 text-base text-slate-900 placeholder-slate-400"
                placeholder="Group Name"
                value={groupName}
                onChangeText={setGroupName}
                autoCapitalize="sentences"
              />
            </View>

            <View className="mb-6 w-full max-w-md">
              <View className="flex-row items-center">
                <TextInput
                  className="flex-1 bg-white border border-slate-300 rounded-l-xl px-4 py-3 text-base text-slate-900 placeholder-slate-400"
                  placeholder="Invite with email"
                  value={inviteEmail}
                  onChangeText={setInviteEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  className="bg-primary px-4 py-3 rounded-r-xl items-center justify-center"
                  onPress={handleAddInvitee}
                  disabled={loading}
                >
                  <Feather name="plus" size={24} color="white" />
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
                      <Ionicons name="close-circle-outline" size={22} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <View className="w-full max-w-md">
              <TouchableOpacity
                className={`py-4 rounded-xl items-center justify-center shadow-md ${
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
