import { useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '@/../context/AppContext';
import DashboardSummary from '@/../components/dashboard/DashboardSummary';
import MonthSelector from '@/../components/common/MonthSelector';
import ExpensePieChart from '@/../components/dashboard/ExpensePieChart';
import RecentTransactions from '@/../components/dashboard/RecentTransactions';
import { getCurrentMonth, getCurrentYear } from '@/../utils/dateUtils';

export default function DashboardScreen() {
  const { income, expenses, savings } = useAppContext();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());

  // Calculate monthly summary
  const monthlySummary = {
    income: income.amount || 0,
    expenses: expenses.reduce((total, exp) => {
      const expDate = new Date(exp.date);
      if (expDate.getMonth() === selectedMonth - 1 && expDate.getFullYear() === selectedYear) {
        return total + exp.amount;
      }
      return total;
    }, 0),
    savings: savings.target || 0,
  };

  const remaining = monthlySummary.income - monthlySummary.expenses - monthlySummary.savings;

  return (
    <SafeAreaView
      // jätetään top inset pois
      edges={['left', 'right', 'bottom']}
      className="flex-1 bg-slate-50"
    >
      <View className="flex-1 p-4 mt-3">
        <View className="mb-1">
          <MonthSelector 
            selectedMonth={selectedMonth} 
            selectedYear={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
          />
        </View>

        <DashboardSummary 
          income={monthlySummary.income}
          expenses={monthlySummary.expenses}
          savings={monthlySummary.savings}
          remaining={remaining}
        />

        <View className="bg-white rounded-xl p-4 mt-4 shadow">
          <Text className="text-lg font-semibold text-slate-900 mb-4">Expenses by category</Text>
          <ExpensePieChart 
            expenses={expenses.filter(exp => {
              const expDate = new Date(exp.date);
              return expDate.getMonth() === selectedMonth - 1 && expDate.getFullYear() === selectedYear;
            })} 
          />
        </View>

        
      </View>
    </SafeAreaView>
  );
}