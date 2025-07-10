import { View, Text } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { getMonthName } from '@/../utils/dateUtils';

interface MonthSelectorProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export default function MonthSelector({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
}: MonthSelectorProps) {
  const handlePreviousMonth = () => {
    if (selectedMonth === 1) {
      onMonthChange(12);
      onYearChange(selectedYear - 1);
    } else {
      onMonthChange(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      onMonthChange(1);
      onYearChange(selectedYear + 1);
    } else {
      onMonthChange(selectedMonth + 1);
    }
  };

  return (
    <View className="flex-row items-center justify-between bg-white rounded-xl py-2 px-3 border border-slate-200">
      <Pressable onPress={handlePreviousMonth} className="p-1">
        <ChevronLeft size={24} color="#64748b" />
      </Pressable>

      <Text className="text-base font-semibold text-slate-900">
        {getMonthName(selectedMonth)} {selectedYear}
      </Text>

      <Pressable onPress={handleNextMonth} className="p-1">
        <ChevronRight size={24} color="#64748b" />
      </Pressable>
    </View>
  );
}
