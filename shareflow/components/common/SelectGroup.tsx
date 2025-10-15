import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  FlatList,
  GestureResponderEvent,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { Group } from '@/../types/groups';
import { useGroups, useAuthStore } from 'context/AppContext';
import { groupApi } from 'api/groups';
import { GroupInvitation } from '@/../types/groups';

interface SelectGroupProps { 
  currentGroupId: number | null;
  onSelectGroup: (group: Group) => void;
  onClose: () => void;
  invites?: GroupInvitation[];
  setInvites?: (invites: GroupInvitation[]) => void;
  setCurrentGroup?: (group: Group) => void;
  handleOpenInviteModal?: () => void;
}

const SelectGroup: React.FC<SelectGroupProps> = ({ currentGroupId, onSelectGroup, onClose, invites, setInvites, setCurrentGroup, handleOpenInviteModal }) => {
  const { userGroups, leaveGroup, setUserGroups } = useGroups();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Group | null>(null);
  const [deleteModalPosition, setDeleteModalPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const [acceptingInviteIds, setAcceptingInviteIds] = useState<Set<number>>(new Set());
  const [acceptedGroupsAtPosition, setAcceptedGroupsAtPosition] = useState<{ [inviteId: number]: Group }>({});
  const [invitePositions, setInvitePositions] = useState<{ [groupId: number]: number }>({});

  const containerRef = useRef<View>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const deleteAnimations = useRef<{ [key: number]: Animated.Value }>({}).current;

  console.log('invites:', invites);
  
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
  }, [userGroups]);

  const handleAcceptInvite = async (invite: GroupInvitation) => {
    const userId = useAuthStore.getState().googleId;
    if (!userId) {
      console.error('User ID is not available');
      return;
    }
    
    console.log(`Accepting invite with ID: ${invite.id}`);
    setAcceptingInviteIds(prev => new Set([...prev, invite.id]));
    
    try {
      await groupApi.acceptInvitation(invite.id, userId);
      console.log(`Accepted invite with ID: ${invite.id}`);
      const group = await groupApi.getGroupWithId(invite.group_id);
      console.log('New group after accepting invite:', group);
      
      const inviteIndex = invites?.findIndex(i => i.id === invite.id) ?? 0;
      setInvitePositions(prev => ({ ...prev, [group.id]: inviteIndex }));
      
      setAcceptedGroupsAtPosition(prev => ({ ...prev, [invite.id]: group }));
      
      const groupsWithoutNew = userGroups.filter(g => g.id !== group.id);
      setUserGroups([...groupsWithoutNew, group]);
      
      setInvites?.(invites?.filter((i) => i.id !== invite.id) || []);
      
      setTimeout(() => {
        setAcceptedGroupsAtPosition(prev => {
          const newState = { ...prev };
          delete newState[invite.id];
          return newState;
        });
      }, 10000);
      
    } catch (error) {
      console.error('Failed to accept invite:', error);
    } finally {
      setAcceptingInviteIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(invite.id);
        return newSet;
      });
    }
  };

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
          duration: 250,
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

  const combinedData = [
  
    ...(invites?.map(invite => ({ type: 'invite' as const, data: invite })) || []),
    
    ...Object.entries(acceptedGroupsAtPosition).map(([inviteId, group]) => ({
      type: 'group' as const,
      data: group,
      fromInvite: true,
      originalPosition: parseInt(inviteId)
    })),
    

    ...userGroups
      .filter(group => {
        const hasPosition = invitePositions[group.id] !== undefined;
        const isInAccepted = Object.values(acceptedGroupsAtPosition).some(g => g.id === group.id);
        return hasPosition && !isInAccepted;
      })
      .sort((a, b) => (invitePositions[a.id] || 0) - (invitePositions[b.id] || 0))
      .map(group => ({
        type: 'group' as const,
        data: group,
        fromInvite: false
      })),
    
    ...userGroups
      .filter(group => invitePositions[group.id] === undefined)
      .map(group => ({ type: 'group' as const, data: group, fromInvite: false }))
  ];

  const renderItem = ({ item }: { item: { type: 'invite' | 'group', data: GroupInvitation | Group, fromInvite?: boolean } }) => {
    if (item.type === 'invite') {
      return renderInviteItem({ item: item.data as GroupInvitation });
    } else {
      return renderGroupItem({ item: item.data as Group, fromInvite: item.fromInvite });
    }
  };

  const renderInviteItem = ({ item }: { item: GroupInvitation }) => {
    const isAccepting = acceptingInviteIds.has(item.id);

    return (
      <View className="bg-white border-t border-slate-100 pl-5 py-2">
        <View className='flex-row justify-between items-center'>
          <View>
            <Text className="text-base font-semibold text-slate-800">{item.group_name}</Text>
            <Text className="text-sm font-sans text-default">{item.inviter_name}</Text>
          </View>
          
          {isAccepting ? (
            <View className="mr-3 py-2 px-4">
              <ActivityIndicator size="small" color="#3B82F6" />
            </View>
          ) : (
            <View className='flex-row items-center gap-1 mr-3'>
              <TouchableOpacity 
                onPress={() => handleAcceptInvite(item)} 
                className="bg-slate-200 py-2 px-4 active:bg-slate-300 rounded-xl"
              >
                <Text className="text-sm font-semibold text-primary">Join</Text>
              </TouchableOpacity>
              <TouchableOpacity className="p-2 rounded-full">
                <X size={16} color="black" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderGroupItem = ({ item, fromInvite }: { item: Group, fromInvite?: boolean }) => {
    const animValue = deleteAnimations[item.id] || new Animated.Value(1);

    const opacityValue = animValue.interpolate({
      inputRange: [0, 0.1, 1], 
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    });

    const animatedStyle = {
      padding: 0,
      opacity: opacityValue,
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
          } ${deletingItemId === item.id ? 'opacity-40' : ''} ${
            fromInvite ? 'bg-green-50' : ''
          }`}
        >
          <Text
            className={`text-base ${
              item.id === currentGroupId ? 'font-bold text-primary' : 'text-slate-700'
            } ${fromInvite ? 'text-green-700 bg-green-50' : ''}`}
          >
            {item.name}
          </Text>
          <View className="flex-row items-center gap-2">
            {fromInvite && <Text className="text-xs text-green-600 font-medium">New!</Text>}
            {item.id === currentGroupId && <Check size={20} color="#3B82F6" />}
          </View>
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
        className="bg-white p-0 rounded-2xl shadow-xl border border-gray-100"
      >
        <Text className="text-lg font-semibold mt-3 px-4 text-slate-800">Settings</Text>
        <Text className="text-sm text-slate-500 px-4 mb-3">
          {itemToDelete.name} groups settings.
        </Text>
        <View className="flex-col justify-center mx-0 px-0">
          <View className="h-px bg-slate-200 w-full my-0 mx-auto" />
          <TouchableOpacity
            onPress={() => {
              setIsDeleteModalVisible(false);
              setItemToDelete(null);
              setCurrentGroup?.(itemToDelete);
              handleOpenInviteModal?.();
            }}
            className="w-full py-3 px-0 mx-0 bg-white rounded-b-2xl text-center justify-center items-center active:bg-slate-50 flex-row items-center gap-3"
          >
            <Text className="font-semibold text-default">Invite</Text>
          </TouchableOpacity>
          <View className="h-px bg-slate-200 w-[90%] my-0 mx-auto" />
        
          <TouchableOpacity
            onPress={() => deleteItem(itemToDelete.id)}
            className="w-full py-3 px-0 mx-0 bg-white rounded-b-2xl text-center justify-center items-center active:bg-slate-50"
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
        className="bg-white rounded-t-2xl pt-3 pb-5 shadow-xl w-full justify-end"
      >
        <View className="flex-row items-center justify-between px-5 pt-1 bg-white">
          <Text className="text-xl font-semibold text-slate-800">Select Group</Text>
          <TouchableOpacity onPress={onClose} className="p-1">
            <X size={24} color="#64748b" />
          </TouchableOpacity>
        </View>
        <Text className="text-sm text-slate-500 px-5 pb-3">Long-press a group for options</Text>

        <FlatList
          data={combinedData}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.type}-${item.data.id}`}
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
