import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Modal from 'react-native-modal';
import { Group } from 'types/groups';
import { ChevronDown, UserPlus, X, Check, ChevronLeft } from 'lucide-react-native';
import { groupApi } from 'api/groups';
import { useRouter } from 'expo-router';
import { useGroups } from 'context/AppContext';



const InviteModal = () => {
  const router = useRouter();
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitees, setInvitees] = useState<string[]>([]);
  const { currentGroup, userGroups } = useGroups();
  const [loading, setLoading] = useState(false);
  const [isEmailInputFocused, setIsEmailInputFocused] = useState(false);
  
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(currentGroup);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);

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

  const handleSelectGroup = (group: Group) => {
    setSelectedGroup(group);
    setShowGroupDropdown(false);
  };

  const handleInvite = async () => {
    if (!selectedGroup?.id || invitees.length === 0) {
      return;
    }

    setLoading(true);
    try {
      for (const email of invitees) {
        await groupApi.inviteMember(selectedGroup.id, email);
      }
      console.log('Invitations sent:', invitees);
    } catch (error) {
      console.error('Failed to invite members:', error);
    } finally {
      setLoading(false);
      router.back();
    }
  };

  const GroupDropdown = () => (
    

        <View className="flex-1 m-0 justify-end">
          <View className="bg-white rounded-xl w-full pb-6">

            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold text-slate-800">Select Group</Text>
              <TouchableOpacity 
                onPress={() => setShowGroupDropdown(false)}
                className="p-1"
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
            <ScrollView className="max-h-60" showsVerticalScrollIndicator={false}>
              {userGroups.map((group) => (
                <TouchableOpacity
                  key={group.id}
                  onPress={() => handleSelectGroup(group)}
                  className={`flex-row items-center justify-between p-4 border-b border-gray-100 ${
                    selectedGroup?.id === group.id ? 'bg-blue-50' : 'bg-white'
                  }`}
                >
                  <View className="flex-1">
                    <Text 
                      className={`text-base font-medium ${
                        selectedGroup?.id === group.id ? 'text-blue-700' : 'text-slate-800'
                      }`}
                    >
                      {group.name}
                    </Text>
                  </View>
                  
                  {selectedGroup?.id === group.id && (
                    <Check size={20} color="#3B82F6" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            {userGroups.length === 0 && (
              <View className="p-8 items-center">
                <Text className="text-slate-500 text-center">
                  No groups available
                </Text>
              </View>
            )}
          </View>
        </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView
              className='flex-1'
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0} 
            >
      <View className="px-4 pb-2 bg-background">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <ChevronLeft size={28} color="#475569" />
        </TouchableOpacity>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            
          }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
      >
        <View className="px-5 items-center">
          <View className="mb-5 flex items-center justify-center">
            <UserPlus size={60} color="#3B82F6" />
          </View>
          <View className="flex-row items-center justify-center mb-2">
            <Text className="text-3xl text-slate-800 text-center mr-4 font-semibold">
              Invite to a Group
            </Text>
          </View>
          <Text className="text-sm text-slate-600 text-center mb-14">
            Select a group and invite people to join.
          </Text>

          <View className="mb-6 w-full max-w-md">
            <TouchableOpacity 
              className={`flex-row items-center justify-between px-4 py-3 rounded-xl border ${
                selectedGroup 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-slate-300 bg-slate-100'
              }`}
              onPress={() => setShowGroupDropdown(true)}
            >
              <Text className={`text-base ${
                selectedGroup ? 'text-blue-700 font-medium' : 'text-slate-500'
              }`}>
                {selectedGroup?.name || 'Select a group'}
              </Text>
              <ChevronDown size={22} color={selectedGroup ? "#3B82F6" : "grey"} />
            </TouchableOpacity>
          </View>

          <View className="mb-6 w-full max-w-md">
            <View className="relative">
              <TextInput
                className="border border-slate-300 rounded-xl px-4 py-3 text-xm text-gray-900  bg-surface placeholder:text-slate-500 tracking-normal font-normal"
                placeholder="Invite with email"
                value={inviteEmail}
                onChangeText={setInviteEmail}
                keyboardType="email-address"
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
            <View className="mb-6 w-full max-w-md">
              <Text className="text-sm font-medium text-slate-700 mb-3">
                Invitees ({invitees.length})
              </Text>
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

      <View className="px-5 py-4 border-slate-200 bg-background static bottom-0 left-0 right-0">
        <View className="w-full max-w-md mx-auto">
          <TouchableOpacity
            className={`py-4 rounded-xl items-center justify-center shadow-md ${
              loading || !selectedGroup?.name.trim() ? 'bg-slate-400' : 'bg-primary active:bg-cyan-700'
            }`}
            disabled={loading || !selectedGroup?.name.trim()}
            onPress={handleInvite}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-base font-semibold">
                Invite {invitees.length > 0 ? `(${invitees.length})` : ''}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        isVisible={showGroupDropdown}
        animationIn='fadeIn'
        animationOut='fadeOut'
        onBackdropPress={() => setShowGroupDropdown(false)}
        statusBarTranslucent={true}
        style={{margin: 0}}
      >
        <GroupDropdown />
      </Modal>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default InviteModal;
