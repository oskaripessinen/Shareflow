import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  FlatList,
  GestureResponderEvent,
  Platform,
  Animated,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { Group } from '@/../types/groups';
import { useGroups, useAuthStore } from 'context/AppContext';
import { groupApi } from 'api/groups';

interface SelectGroupProps {
  currentGroupId: number | null;
  onSelectGroup: (group: Group) => void;
  onClose: () => void;
}

const SelectGroup: React.FC<SelectGroupProps> = ({ currentGroupId, onSelectGroup, onClose }) => {
  const { userGroups, leaveGroup } = useGroups();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Group | null>(null);
  const [deleteModalPosition, setDeleteModalPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const containerRef = useRef<View>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isDeleteModalVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [isDeleteModalVisible, fadeAnim]);

  const deleteItem = async (id: number) => {
    if (!itemToDelete) return;
    console.log(`Deleting group with id: ${id}`);
    const userId = useAuthStore.getState().googleId;

    if (!userId) {
      console.error('User ID is not available');
      setIsDeleteModalVisible(false);
      setItemToDelete(null);
      return;
    }

    try {
      await groupApi.leaveGroup(id, userId);
      leaveGroup(id);
      console.log('Successfully left/deleted group:', id);
    } catch (error) {
      console.error('Failed to leave/delete group:', error);
    }
    setIsDeleteModalVisible(false);
    setItemToDelete(null);
  };

  const handleLongPress = (group: Group, event: GestureResponderEvent) => {
    const { pageY } = event.nativeEvent;

    containerRef.current?.measure((_fx, _fy, _width, _height, _containerPageX, containerPageY) => {
      const topPosition = pageY - containerPageY - 150;
      setDeleteModalPosition({ top: topPosition, left: 20 });
      setItemToDelete(group);
      setIsDeleteModalVisible(true);
    });
  };

  const renderGroupItem = ({ item }: { item: Group }) => (
    <Pressable
      onPress={() => {
        if (isDeleteModalVisible) {
          setIsDeleteModalVisible(false);
          setItemToDelete(null);
          return;
        }
        onSelectGroup(item);
      }}
      onLongPress={(event) => handleLongPress(item, event)}
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

  const renderDeleteConfirmationModal = () => {
    if (!itemToDelete || !deleteModalPosition) {
      return null;
    }

    return (
      <Animated.View
        style={{
          position: 'absolute',
          top: deleteModalPosition.top,
          left: deleteModalPosition.left,
          right: 20,
          zIndex: 1000,
          opacity: fadeAnim,
        }}
        className="bg-white pt-0 rounded-2xl shadow-xl border border-gray-200"
      >
        <Text className="text-lg font-semibold mt-3 mb-0 px-4 text-slate-800">Settings</Text>
        <Text className="text-sm text-slate-500 px-4 mb-3">
          {itemToDelete.name} groups settings.
        </Text>
        <View className="flex-row justify-center mx-0 px-0">
          <TouchableOpacity
            onPress={() => deleteItem(itemToDelete.id)}
            className="w-full py-3 px-0 mx-0 bg-white rounded-b-2xl text-center justify-center items-center border-t border-slate-200 active:bg-slate-50"
          >
            <Text className="font-semibold text-danger">Leave Group</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <View className="flex-1 justify-end">
      <Pressable
        ref={containerRef}
        onPress={(e) => {
          if (isDeleteModalVisible) {
            setIsDeleteModalVisible(false);
            setItemToDelete(null);
          } else {
            e.stopPropagation();
          }
        }}
        className="bg-white rounded-t-2xl pt-3 pb-5 shadow-lg w-full justify-end"
      >
        <View className="flex-row items-center justify-between px-5 pt-1 bg-white">
          <Text className="text-xl font-semibold text-slate-800">Select Group</Text>
          <Pressable onPress={onClose} className="p-1">
            <X size={24} color="#64748b" />
          </Pressable>
        </View>
        <Text className="text-sm text-slate-500 px-5 pb-3">Long-press a group for options</Text>

        <FlatList
          data={userGroups}
          renderItem={renderGroupItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 20 : 10 }}
          className="bg-white"
        />

        {renderDeleteConfirmationModal()}
      </Pressable>
      {isDeleteModalVisible && (
        <Pressable
          className="absolute w-full h-full bg-transparent"
          style={{ zIndex: 0 }}
          onPress={() => {
            setIsDeleteModalVisible(false);
            setItemToDelete(null);
          }}
        />
      )}
    </View>
  );
};

export default SelectGroup;
