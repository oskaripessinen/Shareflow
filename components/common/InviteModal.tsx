import React, { useState } from "react";
import { View, Text, Pressable, TextInput, ScrollView, Alert } from "react-native";
import { X, Plus, Mail, Users, Trash2 } from "lucide-react-native";
import { Group } from "@/../types/groups";


interface InviteModalProps {
  onClose: () => void;
  groups: Group[];
}

const InviteModal: React.FC<InviteModalProps> = ({ onClose, groups }) => {
  const [emails, setEmails] = useState<string[]>(['']);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log("groups", groups);

  const addEmailField = () => {
    setEmails([...emails, '']);
  };

  const removeEmailField = (index: number) => {
    if (emails.length > 1) {
      const newEmails = emails.filter((_, i) => i !== index);
      setEmails(newEmails);
    }
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendInvites = async () => {
    const validEmails = emails.filter(email => email.trim() !== '');
    const invalidEmails = validEmails.filter(email => !validateEmail(email));

    if (validEmails.length === 0) {
      Alert.alert('Error', 'Please enter at least one email address');
      return;
    }

    if (invalidEmails.length > 0) {
      Alert.alert('Error', `Invalid email addresses: ${invalidEmails.join(', ')}`);
      return;
    }

    if (!selectedGroup) {
      Alert.alert('Error', 'Please select a group');
      return;
    }

    setIsLoading(true);
    
  };

  return (
    <View className="flex-1 justify-center items-center bg-black/50">
      <View className="bg-white rounded-xl shadow-lg w-11/12 max-w-md h-4/5 flex">

        <View className="flex-row items-center justify-between p-6 border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-800">Invite Members</Text>
          <Pressable onPress={onClose} className="p-1">
            <X size={24} color="#6B7280" />
          </Pressable>
        </View>
        <View className="flex-1">
          <ScrollView 
            className="flex-1" 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 24 }} 
          >
            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <Users size={16} color="#6B7280" />
                <Text className="text-sm font-medium text-gray-700 ml-2">
                  Select Group
                </Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row space-x-3">
                  {groups.map((group) => (
                    <Pressable
                      key={group.id}
                      onPress={() => setSelectedGroup(group)}   
                      className={`px-4 py-3 rounded-lg border-2 min-w-[120px] ${
                        selectedGroup?.id === group.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <Text 
                        className={`font-medium text-center ${
                          selectedGroup?.id === group.id ? 'text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        {group.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <Mail size={16} color="#6B7280" />
                  <Text className="text-sm font-medium text-gray-700 ml-2">
                    Email Addresses
                  </Text>
                </View>
                <Pressable
                  onPress={addEmailField}
                  className="flex-row items-center bg-blue-500 px-3 py-1 rounded-full"
                >
                  <Plus size={16} color="white" />
                  <Text className="text-white text-sm ml-1 font-medium">Add</Text>
                </Pressable>
              </View>

              {emails.map((email, index) => (
                <View key={index} className="flex-row items-center mb-3">
                  <TextInput
                    value={email}
                    onChangeText={(text) => updateEmail(index, text)}
                    placeholder={`Email address ${index + 1}`}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-base"
                    style={{
                      borderColor: email && !validateEmail(email) ? '#EF4444' : '#D1D5DB'
                    }}
                  />
                  {emails.length > 1 && (
                    <Pressable
                      onPress={() => removeEmailField(index)}
                      className="ml-3 p-2 bg-red-100 rounded-lg"
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </Pressable>
                  )}
                </View>
              ))}
            </View>

            <View className="bg-gray-50 rounded-lg p-4 mb-6">
              <Text className="text-sm text-gray-600">
                <Text className="font-medium">
                  {emails.filter(email => email.trim() !== '').length}
                </Text>{' '}
                email(s) will be invited to{' '}
                <Text className="font-medium">
                  {selectedGroup ? selectedGroup.name : 'selected group'}
                </Text>
              </Text>
            </View>
          </ScrollView>
        </View>

        <View className="flex-row space-x-3 p-6 border-t border-gray-200">
          <Pressable
            onPress={onClose}
            className="flex-1 py-3 rounded-lg border border-gray-300"
          >
            <Text className="text-gray-700 text-center font-medium">Cancel</Text>
          </Pressable>
          
          <Pressable
            onPress={handleSendInvites}
            disabled={isLoading}
            className={`flex-1 py-3 rounded-lg ${
              isLoading ? 'bg-gray-400' : 'bg-blue-500'
            }`}
          >
            <Text className="text-white text-center font-medium">
              {isLoading ? 'Sending...' : 'Send Invites'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default InviteModal;