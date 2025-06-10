import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  FlatList,
  GestureResponderEvent,
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
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

  const containerRef = useRef<View>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const deleteAnimations = useRef<{ [key: number]: Animated.Value }>({}).current;

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

  useEffect(() => {
    userGroups.forEach((group) => {
      if (!deleteAnimations[group.id]) {
        deleteAnimations[group.id] = new Animated.Value(1);
      }
    });
  }, [userGroups, deleteAnimations]);

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
      setDeletingItemId(id);
      setIsDeleteModalVisible(false);
      setItemToDelete(null);

      if (deleteAnimations[id]) {
        Animated.timing(deleteAnimations[id], {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start(async () => {
          await groupApi.leaveGroup(id, userId);
          leaveGroup(id);
          setDeletingItemId(null);
          console.log('Successfully left/deleted group:', id);
        });
      } else {
        await groupApi.leaveGroup(id, userId);
        leaveGroup(id);
        setDeletingItemId(null);
      }
    } catch (error) {
      console.error('Failed to leave/delete group:', error);
      setDeletingItemId(null);
      if (deleteAnimations[id]) {
        Animated.timing(deleteAnimations[id], {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    }
    if (userGroups.length === 1) {
      onClose();
    }
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

  const renderGroupItem = ({ item }: { item: Group }) => {
    const animValue = deleteAnimations[item.id] || new Animated.Value(1);

    const animatedStyle = {
      opacity: animValue,
      height: animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 50],
      }),
      transform: [
        {
          scaleY: animValue,
        },
      ],
    };

    return (
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={() => {
            if (isDeleteModalVisible) {
              setIsDeleteModalVisible(false);
              setItemToDelete(null);
              return;
            }
            if (deletingItemId === item.id) return;
            onSelectGroup(item);
          }}
          onLongPress={(event) => {
            if (deletingItemId === item.id) return;
            handleLongPress(item, event);
          }}
          className={`py-4 px-5 border-t border-slate-100 flex-row justify-between items-center active:bg-slate-50 ${
            item.id === currentGroupId ? 'bg-slate-100' : 'bg-white'
          } ${deletingItemId === item.id ? 'opacity-40' : ''}`}
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
      </Animated.View>
    );
  };

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
          shadowColor: '#000',
          shadowOpacity: 0.5,
          shadowRadius: 5,
          elevation: 5,
        }}
        className="bg-white p-0 rounded-2xl shadow-xl border border-gray-200"
      >
        <Text className="text-lg font-semibold mt-3 px-4 text-slate-800">Settings</Text>
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
        className="bg-white rounded-t-2xl pt-3 shadow-xl w-full justify-end"
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
          contentContainerStyle={{ paddingBottom: 5 }}
          className="bg-white"
        />

        {renderDeleteConfirmationModal()}
      </Pressable>
      {isDeleteModalVisible && (
        <Pressable
          className="absolute w-full h-full"
          style={{ zIndex: -1000 }}
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
