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
        <View className="flex-row items-center justify-center py-5 border-b border-slate-200 bg-white">
          <Text className="text-xl font-semibold text-slate-800">Create New Group</Text>
        </View>

        <ScrollView className="flex-1 h-[100%]" contentContainerStyle={{ marginTop: '50%' }}>
          <View className="p-5">
            <View className="mb-6">
              <TextInput
                className="bg-white border border-slate-300 rounded-lg px-4 py-3 text-base text-slate-900 placeholder-slate-400"
                placeholder="group name"
                value={groupName}
                onChangeText={setGroupName}
                autoCapitalize="sentences"
              />
            </View>
            <View className="mb-6">
              <View className="flex-row items-center">
                <TextInput
                  className="flex-1 bg-white border border-slate-300 rounded-l-lg px-4 py-3 text-base text-slate-900 placeholder-slate-400"
                  placeholder="invite with email"
                  value={inviteEmail}
                  onChangeText={setInviteEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  className="bg-cyan-500 px-4 py-3 rounded-r-lg items-center justify-center"
                  onPress={handleAddInvitee}
                  disabled={loading}
                >
                  <Feather name="plus" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {invitees.length > 0 && (
              <View className="mb-6">
                {invitees.map((email, index) => (
                  <View
                    key={index}
                    className="flex-row items-center justify-between bg-white p-3 rounded-lg border border-slate-200 mb-2"
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

            <TouchableOpacity
              className={`py-4 rounded-lg items-center justify-center shadow-md ${
                loading ? 'bg-primary' : 'bg-cyan-600'
              }`}
              onPress={handleCreateGroup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-base font-semibold">Create Group</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
