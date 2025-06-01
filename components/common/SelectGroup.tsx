import React from 'react';
import { View, Text, Pressable, FlatList, Platform } from 'react-native';
import { X, Check } from 'lucide-react-native';
import { Group } from '@/../types/groups';

interface SelectGroupProps {
  groups: Group[];
  currentGroupId: number | null;
  onSelectGroup: (group: Group) => void;
  onClose: () => void;
}

const SelectGroup: React.FC<SelectGroupProps> = ({
  groups,
  currentGroupId,
  onSelectGroup,
  onClose,
}) => {
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
      className="bg-white rounded-t-2xl pt-3 pb-5 shadow-lg w-full f"
    >
      <View className="flex-row items-center justify-between px-5 mt-1 mb-4">
        <Text className="text-xl font-semibold text-slate-800">Select Group</Text>
        <Pressable onPress={onClose} className="p-1">
          <X size={24} color="#64748b" />
        </Pressable>
      </View>

      <FlatList
        data={groups}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 20 : 0 }}
      />
    </Pressable>
  );
};

export default SelectGroup;
