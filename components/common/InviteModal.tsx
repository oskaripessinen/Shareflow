import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Modal,
} from 'react-native';
import { Group } from 'types/groups';
import { ChevronDown, UserPlus, X, Check, ChevronLeft } from 'lucide-react-native';

interface CreateGroupScreenProps {
  groups: Group[];
  onClose: () => void;
  currentGroup: Group | null;
};

const CreateGroupScreen = ({groups, onClose, currentGroup}: CreateGroupScreenProps) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitees, setInvitees] = useState<string[]>([]);
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

  const GroupDropdown = () => (
    <Modal
      visible={showGroupDropdown}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowGroupDropdown(false)}
      statusBarTranslucent={true}
    >
      <TouchableOpacity 
        className="flex-1 bg-black/50"
        activeOpacity={1}
        onPress={() => setShowGroupDropdown(false)}
      >
        <View className="flex-1 justify-end">
          <View className="bg-white rounded-xl shadow-lg w-full">

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
              {groups.map((group) => (
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

            {groups.length === 0 && (
              <View className="p-8 items-center">
                <Text className="text-slate-500 text-center">
                  No groups available
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="px-5 mt-16 pb-2 bg-background">
        <TouchableOpacity onPress={onClose} className="p-1">
          <ChevronLeft size={28} color="#475569" />
        </TouchableOpacity>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: 200,
          paddingBottom: 20,
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
              className={`flex-row items-center justify-between p-4 rounded-xl border ${
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
                className="border border-slate-300 rounded-xl px-4 py-3 text-base text-gray-900 bg-surface placeholder:text-slate-500"
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
      <GroupDropdown />
    </SafeAreaView>
  );
}

export default CreateGroupScreen;
