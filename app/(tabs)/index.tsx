import { useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MonthSelector from '@/../components/common/MonthSelector';
import { getCurrentMonth, getCurrentYear } from '@/../utils/dateUtils';

export default function DashboardScreen() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} className="flex-1 bg-slate-50">
      <View className="flex-1 p-4 mt-3">
        <View className="mb-1">
          <MonthSelector
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />
        </View>

        <View className="bg-white rounded-xl p-4 mt-4 shadow">
          <Text className="text-lg font-semibold text-slate-900 mb-4">Expenses by category</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
