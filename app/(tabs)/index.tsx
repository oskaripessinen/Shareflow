import { useState } from 'react';
import { View } from 'react-native';
import InvestmentSummary from '../../components/investments/InvestmentSummary'
import ExpenseSummary from 'components/expenses/expensesSummary';
import MonthSelector from '@/../components/common/MonthSelector';
import { getCurrentMonth, getCurrentYear } from '@/../utils/dateUtils';

export default function DashboardScreen() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());

  return (
    <View className="flex-1 bg-background">
        <View className='m-4'>
          <InvestmentSummary portfolioValue={200} investedValue={100} totalGain={100} percentGain={100}/>
        </View>
        <View className='bg-surface border border-slate-300 flex-1 pt-4 rounded-xl m-4 mt-0'>
          <View className="mb-1 mx-4">
            <MonthSelector
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={setSelectedMonth}
              onYearChange={setSelectedYear}
            />
          </View>
          <View className='m-4'> 
            <ExpenseSummary totalExpenses={0}/>
          </View>
        </View>
    </View>
  );
}
