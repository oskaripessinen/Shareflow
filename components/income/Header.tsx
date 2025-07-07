import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Plus, Clock } from 'lucide-react-native';
import { Income } from '@/../context/AppContext';

interface HeaderProps {
  selectedTimeWindow: string;
  showTimeWindowPicker: boolean;
  filteredIncomes: Income[];
  setShowTimeWindowPicker: (show: boolean) => void;
  setShowAddIncomeModal: (show: boolean) => void;
  timeWindowOptions: { label: string; value: string }[];
}

const Header: React.FC<HeaderProps> = ({
  selectedTimeWindow,
  filteredIncomes,
  setShowTimeWindowPicker,
  setShowAddIncomeModal,
  timeWindowOptions,
}) => {
  const totalIncome = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);
  const selectedOption = timeWindowOptions.find(option => option.value === selectedTimeWindow);

  return (
    <View className="bg-white mx-4 rounded-xl p-4 mb-4 border border-slate-200">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-default">Income Summary</Text>
        <Pressable
          onPress={() => setShowAddIncomeModal(true)}
          className="bg-primary rounded-xl pl-1 py-2 pr-2 flex-row items-center justify-center gap-1 min-w-[90px] active:bg-primary/80"
        >
          <Plus size={18} color="white" strokeWidth={2.2} />
          <Text className='text-base text-white font-sans'>Income</Text>
        </Pressable>
      </View>

      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold text-green-600">
            +€{totalIncome.toFixed(2)}
          </Text>
        </View>

        <Pressable
          onPress={() => setShowTimeWindowPicker(true)}
          className="flex-row items-center bg-slate-100 rounded-xl px-3 py-2 min-w-[90px] border border-slate-200 active:bg-slate-200"
        >
          <Clock size={16} color="#64748b" />
          <Text className="ml-4 text-sm font-medium text-slate-700">
            {selectedOption?.label || 'Select'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Header;