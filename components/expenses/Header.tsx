import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Plus, Clock } from 'lucide-react-native';
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
      <View className="flex-row gap-1 items-center mb-5 justify-between px-4">
        <View className="relative" style={{ zIndex: 1 }}>
          <View className="flex-row items-center bg-white rounded-xl border border-slate-200">
            <Pressable
              onPress={() => {
                setShowTimeWindowPicker(!showTimeWindowPicker);
              }}
              className="flex-row items-center rounded-l-lg border-r py-3 px-3 border-slate-200 text-center active:bg-slate-100"
            >
              <Clock size={16} color="#64748b" strokeWidth={2.5} />
              <Text className="font-medium font-semibold text-slate-700 text-base pl-2" numberOfLines={1}>
                {timeWindowOptions.find((opt) => opt.value === selectedTimeWindow)?.label}
              </Text>
            </Pressable>
            <View className="py-3 px-1">
              <Text className="font-semibold text-default px-2 text-center text-base" numberOfLines={1}>
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
          className="flex-row items-center bg-primary p-3 rounded-xl active:bg-primaryDark"
        >
          <Plus strokeWidth={2.2} size={18} color="#fff" />
          
        </Pressable>
      </View>
    </View>
  );
};

export default Header;