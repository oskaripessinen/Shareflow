import React, { useState } from 'react';
import { View, Text, Pressable, SafeAreaView, Platform, Modal } from 'react-native';
import { Users, ChevronDown } from 'lucide-react-native';
import SelectGroup from '@/../components/common/SelectGroup';
import { useGroups } from '@/../context/AppContext';
import { Group } from '@/../types/groups';

const GroupHeader = () => {
  const { groups } = useGroups();
  const [currentGroup, setCurrentGroup] = useState<Group | null>(groups[0] || null);
  const [availableGroups] = useState<Group[]>(groups);
  const [isGroupSelectorModalVisible, setIsGroupSelectorModalVisible] = useState(false);
  console.log('Available groups:', groups);

  const handleSelectGroup = (group: Group) => {
    setCurrentGroup(group);
    setIsGroupSelectorModalVisible(false);
    console.log('Selected group:', group);
  };

  return (
    <>
      <SafeAreaView
        className="bg-slate-50 shadow-sm z-20"
        style={{ paddingTop: Platform.OS === 'android' ? 40 : 0 }}
      >
        <View className="flex-row items-center justify-between px-4 mb-3 pt-5 border-b-1 border-slate-600">
          <Pressable
            onPress={() => setIsGroupSelectorModalVisible(true)}
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
            groups={availableGroups}
            currentGroupId={currentGroup?.id || null}
            onSelectGroup={handleSelectGroup}
            onClose={() => setIsGroupSelectorModalVisible(false)}
          />
        </Pressable>
      </Modal>
    </>
  );
};

export default GroupHeader;
