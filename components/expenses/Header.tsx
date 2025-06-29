import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronDown, Plus } from 'lucide-react-native';
import { Expense } from '../../types/expense';

interface TimeWindowOption {
  label: string;
  value: string;
}

interface HeaderProps {
  selectedTimeWindow: string;
  showTimeWindowPicker: boolean;
  filteredExpenses: Expense[];
  setShowTimeWindowPicker: (show: boolean) => void;
  setShowAddExpenseModal: (show: boolean) => void;
  timeWindowOptions: TimeWindowOption[];
}

const Header: React.FC<HeaderProps> = ({
  selectedTimeWindow,
  showTimeWindowPicker,
  filteredExpenses,
  setShowTimeWindowPicker,
  setShowAddExpenseModal,
  timeWindowOptions,
}) => {
  return (
    <View className="p-0 mt-0" style={{ zIndex: 10 }}>
      <View className="flex-row items-center mb-5 justify-between px-4">
        <View className="relative" style={{ zIndex: 1 }}>
          <View className="flex-row items-center bg-white rounded-xl border border-slate-200">
            <Pressable
              onPress={() => {
                setShowTimeWindowPicker(!showTimeWindowPicker);
              }}
              style={{
                minWidth: 100,
                height: '100%',
                paddingHorizontal: 20,
                justifyContent: 'space-between',
              }}
              className="flex-row items-center my-0 py-0 rounded-l-xl pr-2 border-r border-slate-200 text-center active:bg-slate-100"
            >
              <Text className="font-medium font-semibold text-default text-base pr-2" numberOfLines={1}>
                {timeWindowOptions.find((opt) => opt.value === selectedTimeWindow)?.label}
              </Text>
              <View className="mr-2">
                <ChevronDown size={16} color="#64748b" />
              </View>
            </Pressable>
            <View className="p-3 pl-2">
              <Text className="font-bold text-default px-2 text-center min-w-[100px]" numberOfLines={1}>
                {(
                  filteredExpenses?.reduce((sum: number, e: Expense) => sum + (Number(e.amount) || 0), 0) || 0
                ).toFixed(2)}{' '}
                €
              </Text>
            </View>
          </View>
        </View>
        <Pressable
          onPress={() => setShowAddExpenseModal(true)}
          className="flex-row items-center bg-primary px-3 py-3 rounded-full active:bg-primaryDark shadow"
        >
          <Plus size={20} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
};

export default Header;