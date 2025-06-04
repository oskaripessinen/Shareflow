import React from 'react';
import { View, Text, Pressable, Platform, TouchableOpacity } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { X, Check } from 'lucide-react-native';
import { Group } from '@/../types/groups';
import { useGroups, useAuthStore } from 'context/AppContext';
import { groupApi } from 'api/groups';

interface SelectGroupProps {
  currentGroupId: number | null;
  onSelectGroup: (group: Group) => void;
  onClose: () => void;
}

const SelectGroup: React.FC<SelectGroupProps> = ({
  currentGroupId,
  onSelectGroup,
  onClose,
}) => {
  const { userGroups, leaveGroup } = useGroups();

  const deleteItem = async (id: number) => {
    console.log(`Leaving group with id: ${id}`);
    const userId = useAuthStore.getState().googleId;

    if (!userId) {
      console.error('User ID is not available');
      return;
    }

    try {
      // Odota API kutsu valmistumista
      await groupApi.leaveGroup(id, userId);
      
      // Päivitä global state vasta API kutsun jälkeen
      leaveGroup(id);
      
      console.log("Successfully left group:", id);
    } catch (error) {
      console.error('Failed to leave group:', error);
    }
  };

  const renderGroupItem = ({ item }: { item: Group }) => (
    <Pressable
      onPress={() => {
        onSelectGroup(item);
      }}
      className={`py-4 px-5 border-t border-slate-100 flex-row justify-between items-center active:bg-slate-50 ${
        item.id === currentGroupId ? 'bg-slate-100' : 'bg-white'
      }`}
    >
      <Text
        className={`text-base ${
          item.id === currentGroupId ? 'font-bold text-primary' : 'text-slate-700'
        }`}
      >
        {item.name}
      </Text>
      {item.id === currentGroupId && <Check size={20} color="#3B82F6" />}
    </Pressable>
  );

  return (
    <Pressable
      onPress={(e) => e.stopPropagation()}
      className="bg-white rounded-t-2xl pt-3 pb-5 shadow-lg w-full"
    >
      <View className="flex-row items-center justify-between px-5 mt-1 mb-4">
        <Text className="text-xl font-semibold text-slate-800">Select Group</Text>
        <Pressable onPress={onClose} className="p-1">
          <X size={24} color="#64748b" />
        </Pressable>
      </View>

      <SwipeListView
        data={userGroups} // Käytä suoraan userGroups hookista
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 20 : 0 }}
        renderHiddenItem={({ item }) => (
          <View className="flex-1 flex-row justify-end items-center bg-red-500 pr-4">
            <TouchableOpacity 
              onPress={() => deleteItem(item.id)}
              className="bg-red-600 px-4 py-2 rounded justify-center items-center"
            >
              <Text className="text-white font-semibold">Leave</Text>
            </TouchableOpacity>
          </View>
        )}
        leftOpenValue={400} 
        previewRowKey={'0'}
        previewOpenValue={40}
        previewOpenDelay={3000}
        onRowOpen={(rowKey) => {
          const item = userGroups.find((d) => d.id.toString() === rowKey);
          if (item) {
            deleteItem(item.id);
          }
        }}
      />
    </Pressable>
  );
};

export default SelectGroup;
