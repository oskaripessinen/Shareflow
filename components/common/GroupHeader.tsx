import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, SafeAreaView, Platform, Modal } from 'react-native';
import { Users, ChevronDown, EllipsisVertical } from 'lucide-react-native';
import SelectGroup from './SelectGroup';
import OptionsModal from './OptionsModal';
import { useGroups } from '@/../context/AppContext';
import { Group } from '@/../types/groups';
import { router } from 'expo-router';

const GroupHeader = () => {
  const { userGroups, currentGroup, setCurrentGroup } = useGroups();
  const [isGroupSelectorModalVisible, setIsGroupSelectorModalVisible] = useState(false);
  const [isOptionsModalVisible, setOptionsModal] = useState(false);

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
      router.push('/create_group');
      return;
    }
    setIsGroupSelectorModalVisible(true);
  };

  return (
    <>
      <SafeAreaView
        className="bg-slate-50 shadow-sm z-20 border-b border-slate-200"
        style={{ paddingTop: Platform.OS === 'android' ? 40 : 0 }}
      >
        <View className="flex-row items-center px-4 mb-3 pt-5">
          <Pressable className="opacity-0 py-1 px-3">
            <EllipsisVertical size={22} color="#475569" />
          </Pressable>
          <Pressable
            onPress={handleOpenGroupSelector}
            className="justify-center flex-row items-center flex-1 py-2 rounded-lg active:bg-slate-100"
          >
            <Users size={22} color="#475569" />
            <Text
              className="text-lg font-semibold text-slate-700 ml-3 mr-1 active:text-slate-600"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {currentGroup ? currentGroup.name : 'Select Group'}
            </Text>
            <ChevronDown size={20} className="active:color-slate-600" />
          </Pressable>
          <Pressable
            onPress={() => setOptionsModal(true)}
            className="py-2 px-1 mx-2 rounded-xl active:bg-slate-100"
          >
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
