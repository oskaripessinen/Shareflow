import { useEffect, useState, useMemo } from 'react';
import { View } from 'react-native';
import InvestmentSummary from '../../components/investments/InvestmentSummary'
import ExpenseSummary from 'components/expenses/expensesSummary';
import MonthSelector from '@/../components/common/MonthSelector';
import { getCurrentMonth, getCurrentYear } from '@/../utils/dateUtils';
import { expenseApi } from 'api/expenses';
import { useGroups } from 'context/AppContext';
import { Expense } from 'types/expense';

interface DashboardScreenProps {
  navigateToTab?: (tabKey: string) => void;
}

const DashboardScreen = ({ navigateToTab }: DashboardScreenProps) => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentGroup } = useGroups();

  const filterExpensesByMonth = (expenses: Expense[], month: number, year: number) => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.created_at);
      return expenseDate.getMonth() + 1 === month && 
             expenseDate.getFullYear() === year;
    });
  };

  const handleExpensePress = () => {
    if (navigateToTab) {
      navigateToTab('expenses');
    }
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!currentGroup?.id) {
        setAllExpenses([]);
        return;
      }

      setLoading(true);
      try {
        const allData = await expenseApi.getExpensesByGroupId(currentGroup.id);
        setAllExpenses(allData);
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
        setAllExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [currentGroup?.id]); 

  const currentMonthExpenses = useMemo(() => {
    return filterExpensesByMonth(allExpenses, selectedMonth, selectedYear);
  }, [allExpenses, selectedMonth, selectedYear]);

  const previousMonthExpenses = useMemo(() => {
    const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
    const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
    return filterExpensesByMonth(allExpenses, prevMonth, prevYear);
  }, [allExpenses, selectedMonth, selectedYear]);

  const totalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const previousMonthTotal = previousMonthExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  const percentChange = useMemo(() => {
    if (previousMonthTotal === 0) {
      return totalExpenses > 0 ? 100 : 0; 
    }
    return ((totalExpenses - previousMonthTotal) / previousMonthTotal) * 100;
  }, [totalExpenses, previousMonthTotal]);

  const latestExpense = useMemo(() => {
    if (currentMonthExpenses.length === 0) return undefined;
    
    const sorted = [...currentMonthExpenses].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    return {
      title: sorted[0].title,
      amount: sorted[0].amount,
      created_at: sorted[0].created_at.toString()
    };
  }, [currentMonthExpenses]);

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
            <ExpenseSummary 
              totalExpenses={totalExpenses}
              previousMonthExpenses={previousMonthTotal}
              percentChange={percentChange}
              latestExpense={latestExpense}
              handleExpensePress={handleExpensePress}
              currency="€"
            />
          </View>
        </View>
    </View>
  );
}

export default DashboardScreen;
