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
    setInvitees(invitees.filter(email => email !== emailToRemove));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      return;
    }
    setLoading(true);
    try {
      // const { data: { user } } = await supabase.auth.getUser();
      // if (!user) throw new Error('User not authenticated');

      // const { data: groupData, error: groupError } = await supabase
      //   .from('groups')
      //   .insert([{ name: groupName, created_by: user.id }])
      //   .select()
      //   .single();

      // if (groupError) throw groupError;
      // console.log('Group created:', groupData);

      // if (groupData && invitees.length > 0) {
      //   const invitationPromises = invitees.map(email =>
      //     supabase.from('group_invitations').insert({
      //       group_id: groupData.id,
      //       invited_email: email,
      //       status: 'pending',
      //       invited_by: user.id
      //     })
      //   );
      //   await Promise.all(invitationPromises);
      //   console.log('Invitations sent/saved for:', invitees);
      // }


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
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Feather name="chevron-left" size={28} color="#0891b2" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-slate-800">
            Create New Group
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
          <View className="p-5">
            {/* Group Name Section */}
            <View className="mb-6">
              <Text className="text-base font-medium mb-2 text-slate-700">
                Group Name
              </Text>
              <TextInput
                className="bg-white border border-slate-300 rounded-lg px-4 py-3 text-base text-slate-900 placeholder-slate-400"
                placeholder="E.g., Family, Work Project, Kämppikset"
                value={groupName}
                onChangeText={setGroupName}
                autoCapitalize="sentences"
              />
            </View>

            {/* Invite Members Section */}
            <View className="mb-6">
              <Text className="text-base font-medium mb-2 text-slate-700">
                Invite Members (Optional)
              </Text>
              <View className="flex-row items-center">
                <TextInput
                  className="flex-1 bg-white border border-slate-300 rounded-l-lg px-4 py-3 text-base text-slate-900 placeholder-slate-400"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChangeText={setInviteEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  className="bg-cyan-500 px-4 py-3 rounded-r-lg items-center justify-center h-[50px]" // H-[50px] vastaamaan inputin korkeutta
                  onPress={handleAddInvitee}
                  disabled={loading}
                >
                  <Feather name="plus" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Invited Members List */}
            {invitees.length > 0 && (
              <View className="mb-6">
                <Text className="text-sm font-medium mb-2 text-slate-600">
                  To be invited:
                </Text>
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

            {/* Create Group Button */}
            <TouchableOpacity
              className={`py-4 rounded-lg items-center justify-center shadow-md ${
                loading ? 'bg-cyan-400' : 'bg-cyan-600'
              }`}
              onPress={handleCreateGroup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-base font-semibold">
                  Create Group
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}