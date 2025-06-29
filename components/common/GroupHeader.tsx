import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, SafeAreaView, Platform, Modal, TouchableOpacity, Image } from 'react-native';
import {  ChevronDown, EllipsisVertical } from 'lucide-react-native';
import SelectGroup from './SelectGroup';
import OptionsModal from './OptionsModal';
import InviteModal from './InviteModal';
import { useGroups } from '@/../context/AppContext';
import { Group } from '@/../types/groups';
import { router } from 'expo-router';
import logo from '../../assets/images/logo.png';

const GroupHeader = () => {
  const { userGroups, currentGroup, setCurrentGroup } = useGroups();
  const [isGroupSelectorModalVisible, setIsGroupSelectorModalVisible] = useState(false);
  const [isOptionsModalVisible, setOptionsModal] = useState(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);

  useEffect(() => {
    if (!currentGroup && userGroups.length > 0) {
      setCurrentGroup(userGroups[0]);
    }
  }, [userGroups, currentGroup, setCurrentGroup]);

  const handleSelectGroup = (group: Group) => {
    setCurrentGroup(group);
    setIsGroupSelectorModalVisible(false);
  };

  const handleOpenGroupSelector = () => {
    if (userGroups.length === 0) {
      router.push('/create_group');
      return;
    }
    setIsGroupSelectorModalVisible(true);
  };

  const handleOpenInviteModal = () => {
    if (!currentGroup) {
      return;
    }
    setIsInviteModalVisible(true);
  };

  return (
    <>
      <SafeAreaView
        className="bg-slate-50 shadow-sm z-20 border-b border-slate-200 w-full" 
        style={{ paddingTop: Platform.OS === 'android' ? 40 : 0 }}
      >
        <View className="flex-row items-center justify-between px-4 py-3">
          <View className="">
            <Image 
              source={logo} 
              style={{ width: 60, height: 40 }} 
            />
          </View>
          <View className="flex-1 items-center left-[5px]">
            <TouchableOpacity
              onPress={handleOpenGroupSelector}
              className="flex-row items-center px-4 py-2 rounded-lg active:bg-slate-200"
            >
              <Text
                className="text-base font-semibold text-slate-700 mr-2"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {currentGroup ? currentGroup.name : 'Select Group'}
              </Text>
              <ChevronDown size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
          
          <View className="w-16 items-end">
            <TouchableOpacity
              onPress={() => setOptionsModal(true)}
              className="p-2 rounded-lg active:bg-slate-200"
            >
              <EllipsisVertical size={22} color="#000000DE" />
            </TouchableOpacity>
          </View>
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
          <OptionsModal onClose={() => setOptionsModal(false)} handleOpenInviteModal={handleOpenInviteModal} />
        </Pressable>
      </Modal>

      <Modal
        visible={isInviteModalVisible}
        animationType="fade"
        onRequestClose={() => setIsInviteModalVisible(false)}
        presentationStyle="overFullScreen"
        statusBarTranslucent={true}
      >
        <InviteModal groups={userGroups} onClose={() => setIsInviteModalVisible(false)} currentGroup={currentGroup} />
      </Modal>
    </>
  );
};

export default GroupHeader;
