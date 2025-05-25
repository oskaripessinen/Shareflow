import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { X, Check } from 'lucide-react-native';

interface TimeWindowOption {
  label: string;
  value: string;
}

interface SelectTimeFrameProps {
  setShowTimeWindowPicker: (visible: boolean) => void;
  selectedTimeWindow: string;
  handleTimeWindowChange: (value: string) => void;
  timeWindowOptions: TimeWindowOption[];
}

export default function SelectTimeFrame({
  setShowTimeWindowPicker,
  selectedTimeWindow,
  handleTimeWindowChange,
  timeWindowOptions,
}: SelectTimeFrameProps) {
  return (
    <Pressable
      className="flex-1 justify-end black"
      onPress={() => setShowTimeWindowPicker(false)}
    >
      <Pressable
        className="bg-white rounded-t-2xl pt-3 pb-5 shadow-lg"
        onPress={(e) => e.stopPropagation()}
      >
        <View className="flex-row items-center justify-between px-5 mt-1 mb-0">
          <Text className="text-xl font-semibold text-DEFAULT">Select Time Frame</Text>
          <Pressable onPress={() => setShowTimeWindowPicker(false)}>
            <X size={24} color="#334155" />
          </Pressable>
        </View>
        <FlatList
          className="mt-4"
          data={timeWindowOptions}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleTimeWindowChange(item.value)}
              className={`py-4 flex-row justify-between px-5 border-t border-slate-100 active:bg-slate-50 ${selectedTimeWindow === item.value ? 'bg-slate-100' : ''}`}
            >
              <Text
                className={`text-DEFAULT text-center ${selectedTimeWindow === item.value ? 'font-bold text-primary' : 'text-slate-700'}`}
              >
                {item.label}
              </Text>
              {item.value === selectedTimeWindow && <Check size={20} color="#3B82F6" />}
            </Pressable>
          )}
        />
      </Pressable>
    </Pressable>
  );
}
