import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, SafeAreaView, Platform, Modal } from 'react-native';
import { Users, ChevronDown, EllipsisVertical } from 'lucide-react-native';
import SelectGroup from './SelectGroup';
import OptionsModal from './OptionsModal';
import { useGroups } from '@/../context/AppContext';
import { Group } from '@/../types/groups';
import { router } from 'expo-router'; // Adjust import based on your routing setup

const GroupHeader = () => {
  const { userGroups, currentGroup, setCurrentGroup } = useGroups();
  const [isGroupSelectorModalVisible, setIsGroupSelectorModalVisible] = useState(false);
  const [isOptionsModalVisible, setOptionsModal] = useState(false);
  console.log('Available groups:', userGroups);

  useEffect(() => {
    if (!currentGroup && userGroups.length > 0) {
      setCurrentGroup(userGroups[0]);
    }
  }, [userGroups, currentGroup, setCurrentGroup]);

  const handleSelectGroup = (group: Group) => {
    setCurrentGroup(group);
    setIsGroupSelectorModalVisible(false);
    console.log('Selected group:', group);
  };

  const handleOpenGroupSelector = () => {
    if (userGroups.length === 0) {
      console.warn('No groups available to select');
      router.push('/create_group'); // Navigate to create group if no groups exist
      return;
    }
    setIsGroupSelectorModalVisible(true);
  };

  return (
    <>
      <SafeAreaView
        className="bg-slate-50 shadow-sm z-20"
        style={{ paddingTop: Platform.OS === 'android' ? 40 : 0 }}
      >
        <View className="flex-row items-center px-4 mb-3 pt-5 border-b-1 border-slate-600">
          <Pressable className="opacity-0 py-1 px-3">
            <EllipsisVertical size={22} color="#475569" />
          </Pressable>
          <Pressable
            onPress={handleOpenGroupSelector}
            className="justify-center flex-row items-center flex-1"
          >
            <Users size={22} color="#475569" />
            <Text
              className="text-lg font-semibold text-slate-700 ml-3 mr-1"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {currentGroup ? currentGroup.name : 'Select Group'}
            </Text>
            <ChevronDown size={20} color="#475569" />
          </Pressable>
          <Pressable onPress={() => setOptionsModal(true)} className="py-1 px-3">
            <EllipsisVertical size={22} color="#475569" />
          </Pressable>
        </View>
      </SafeAreaView>

      <Modal
        visible={isGroupSelectorModalVisible}
        animationType="fade"
        onRequestClose={() => setIsGroupSelectorModalVisible(false)}
        presentationStyle="overFullScreen"
        backdropColor="transparent"
        statusBarTranslucent={true}
      >
        <Pressable
          className="flex-1 justify-end"
          onPress={() => setIsGroupSelectorModalVisible(false)}
        >
          <SelectGroup
            currentGroupId={currentGroup?.id || null}
            onSelectGroup={handleSelectGroup}
            onClose={() => setIsGroupSelectorModalVisible(false)}
          />
        </Pressable>
      </Modal>

      <Modal
        visible={isOptionsModalVisible}
        animationType="fade"
        onRequestClose={() => setOptionsModal(false)}
        presentationStyle="overFullScreen"
        backdropColor="transparent"
        statusBarTranslucent={true}
      >
        <Pressable className="flex-1 justify-end" onPress={() => setOptionsModal(false)}>
          <OptionsModal onClose={() => setOptionsModal(false)} />
        </Pressable>
      </Modal>
    </>
  );
};

export default GroupHeader;
