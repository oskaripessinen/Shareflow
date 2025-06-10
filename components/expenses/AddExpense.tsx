import React from 'react';
import { Text, Pressable, View } from 'react-native';
import { Image, Edit3, X } from 'lucide-react-native';

interface AddExpenseProps {
  onClose: () => void;
}

const AddExpense: React.FC<AddExpenseProps> = ({ onClose }) => {
  return (
    <Pressable className="flex-1 justify-end" onPress={onClose}>
      <Pressable
        className="bg-white rounded-t-2xl pt-5 pb-5 px-5 w-full shadow-lg"
        onPress={(e) => e.stopPropagation()}
      >
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold text-slate-800">Add Expense</Text>
          <Pressable onPress={onClose} className="p-1">
            <X size={24} color="#64748b" />
          </Pressable>
        </View>

        <View className="w-full items-center">
          <View className="w-full">
            <Pressable className="flex-row items-center p-3.5 rounded-lg w-full active:bg-slate-50 justify-center">
              <Edit3 size={22} color="black" className="mr-3" />
              <Text className="text-base font-medium text-slate-700 ml-4">Add Manually</Text>
            </Pressable>
            <View className="h-px bg-slate-200 w-full my-2" />
            <Pressable className="flex-row items-center p-3.5 rounded-lg w-full justify-center active:bg-slate-50">
              <Image size={22} color="black" className="mr-3" />
              <Text className="font-medium text-slate-700 ml-4">Add With an Image</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Pressable>
  );
};

export default AddExpense;
