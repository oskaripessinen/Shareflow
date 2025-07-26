import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useAuth, useGroups } from '../context/AppContext';
import { useRouter } from 'expo-router';
import { ChevronLeft, Users, X } from 'lucide-react-native';
import { groupApi } from 'api/groups';

export default function CreateGroupScreen() {
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitees, setInvitees] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEmailInputFocused, setIsEmailInputFocused] = useState(false);
  const { googleId } = useAuth();
  const { setUserGroups } = useGroups();

  useEffect(() => {
    if (inviteEmail.endsWith('.com')) {
      setInvitees([...invitees, inviteEmail.trim().toLowerCase()]);
      setInviteEmail('');
    }
  }, [inviteEmail]);

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
      const groupData = {
        name: groupName.trim(),
        invitees: invitees.length > 0 ? invitees : undefined,
      };
      if (!googleId) {
        console.error('Google ID is not available');
        return;
      }

      await groupApi.createGroup(groupData, googleId);
      console.log('Group created:', groupName, 'with invitees:', invitees);
      const groups = await groupApi.getUserGroups();
      setUserGroups(groups);

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
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-3 pt-12 pb-2 bg-background">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <ChevronLeft size={28} color="#475569" />
        </TouchableOpacity>
      </View>
      
      <View className="flex-1 justify-center px-5">
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center">
            <View className="mb-8 flex items-center justify-center">
              <Users size={60} color="#3B82F6" />
            </View>
            
            <Text className="text-3xl text-slate-800 text-center font-semibold mb-2">
              Create a New Group
            </Text>
            
            <Text className="text-sm text-slate-600 text-center mb-12">
              Enter the group name and optionally invite members.
            </Text>

            <View className="mb-6 w-full">
              <TextInput
                className="border border-slate-300 rounded-xl px-4 py-3 text-base text-gray-900 placeholder:text-slate-500"
                placeholder="Group Name"
                value={groupName}
                onChangeText={setGroupName}
                autoCapitalize="sentences"
              />
            </View>

            <View className="mb-6 w-full">
              <View className="relative">
                <TextInput
                  className="border border-slate-300 rounded-xl px-4 py-3 text-base text-gray-900 placeholder:text-slate-500"
                  placeholder="Invite with email (optional)"
                  value={inviteEmail}
                  onChangeText={setInviteEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onSubmitEditing={handleAddInvitee}
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
                      <Text
                        className={`p-1 text-base ${
                          loading || !inviteEmail.trim()
                            ? 'text-slate-300 font-sans'
                            : 'text-primary font-semibold'
                        }`}
                      >
                        Add
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {invitees.length > 0 && (
              <View className="mb-6 w-full">
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
      </View>

      <View className="px-5 py-4 border-slate-200 bg-background">
        <View className="w-full mx-auto">
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
    </SafeAreaView>
  );
}
