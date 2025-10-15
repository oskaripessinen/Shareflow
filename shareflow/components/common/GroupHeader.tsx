import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';
import {  ChevronDown, EllipsisVertical } from 'lucide-react-native';
import SelectGroup from './SelectGroup';
import OptionsModal from './OptionsModal';
import { useGroups, useAuthStore } from '@/../context/AppContext';
import { Group } from '@/../types/groups';
import { router } from 'expo-router';
import logo from '../../assets/images/logo.png';
import { groupApi } from '@/../api/groups';
import { GroupInvitation } from '@/../types/groups';

const GroupHeader = () => {
  const { userGroups, currentGroup, setCurrentGroup } = useGroups();
  const { googleId } = useAuthStore();
  const [isGroupSelectorModalVisible, setIsGroupSelectorModalVisible] = useState(false);
  const [isOptionsModalVisible, setOptionsModal] = useState(false);
  const [invites, setInvites] = useState<GroupInvitation[]>([]);

  const fetchInvites = async () => {
    try {
      if (!googleId) {
        console.warn('No Google ID found, cannot fetch invites');
        return;
      }
      const invites = await groupApi.getGroupInvitations();
      setInvites(invites);
    } catch (error) {
      console.error('Error fetching invites:', error);
    }
  }

  useEffect(() => {
    if (!googleId) {
      console.warn('No Google ID found, cannot fetch user groups');
      return;
    }
    fetchInvites();
  }, [googleId]);

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


  return (
    <>
      <SafeAreaView
        className="bg-slate-50 shadow-sm z-20 border-b border-slate-200 w-full" 
        style={{ paddingTop: 40 }}
      >
        <View className="flex-row items-center justify-between px-2 pt-2 pb-1">
          <View className="flex-row items-center">
            <Image 
              source={logo} 
              style={{ width: 50, height: 40 }} 
            />

          </View>
          <View className="flex-1 items-center">
            <TouchableOpacity
              onPress={handleOpenGroupSelector}
              className="flex-row items-center pl-8 pr-4 py-2 rounded-lg justify-center w-full"
            >
              <View className="flex-row items-center justify-between">
                <Text
                  className="text-base font-semibold text-default mr-1"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {currentGroup ? currentGroup.name : 'Select Group'}
                </Text>
                <ChevronDown size={20} color="black" />
                {invites.length > 0 && (
                  <View className="absolute -top-2 -left-5 bg-primary rounded-full w-5 h-5 items-center justify-center border-2 border-white">
                    <Text className="text-white text-[8px] font-bold">
                      {invites.length}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            
          </View>
          
          <View className="w-16 items-end flex-row justify-end">

            <TouchableOpacity
              onPress={() => setOptionsModal(true)}
              className="p-2 rounded-lg"
            >
              <EllipsisVertical size={22} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>


      <Modal
        isVisible={isGroupSelectorModalVisible}
        animationIn="fadeIn"
        animationOut="fadeOut"
        onSwipeComplete={() => setIsGroupSelectorModalVisible(false)}
        onBackdropPress={() => setIsGroupSelectorModalVisible(false)}
        swipeDirection="down"
        backdropOpacity={0.5}
        statusBarTranslucent={true}
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >

          <SelectGroup
            currentGroupId={currentGroup?.id || null}
            onSelectGroup={handleSelectGroup}
            onClose={() => setIsGroupSelectorModalVisible(false)}
            invites={invites}
            setInvites={setInvites}
            setCurrentGroup={setCurrentGroup}
          />
      </Modal>

      

      <Modal
        isVisible={isOptionsModalVisible}
        animationIn="fadeIn"
        animationOut="fadeOut"
        onSwipeComplete={() => setOptionsModal(false)}
        onBackdropPress={() => setOptionsModal(false)}
        swipeDirection={'down'}
        backdropOpacity={0.5}
        statusBarTranslucent={true}
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
          <OptionsModal onClose={() => setOptionsModal(false)} />
      </Modal>

      
    </>
  );
};

export default GroupHeader;
