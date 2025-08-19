import { useEffect, useState, useMemo } from 'react';
import { View, Animated, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import InvestmentSummary from '../../components/investments/InvestmentSummary'
import ExpenseSummary from 'components/expenses/expensesSummary';
import IncomeSummary from 'components/income/incomeSummary';
import MonthSelector from '@/../components/common/MonthSelector';
import { getCurrentMonth, getCurrentYear } from '@/../utils/dateUtils';
import { expenseApi } from 'api/expenses';
import { incomeApi } from 'api/income';
import { useGroups } from 'context/AppContext';
import { Expense } from 'types/expense';
import { Income } from 'context/AppContext'

interface DashboardScreenProps {
  navigateToTab?: (tabKey: string) => void;
}

const DashboardScreen = ({ navigateToTab }: DashboardScreenProps) => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [allIncome, setAllIncome] = useState<Income[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { currentGroup } = useGroups();
  const [pageOpacity] = useState(new Animated.Value(0));

  const filterExpensesByMonth = (expenses: Expense[], month: number, year: number) => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.created_at);
      return expenseDate.getMonth() + 1 === month && 
             expenseDate.getFullYear() === year;
    });
  };

  const filterIncomeByMonth = (incomes: Income[], month: number, year: number) => {
    return incomes.filter(income => {
      const incomeDate = new Date(income.created_at);
      return incomeDate.getMonth() + 1 === month && 
             incomeDate.getFullYear() === year;
    });
  };

  const handleExpensePress = () => {
    if (navigateToTab) {
      navigateToTab('expenses');
    }
  };

  const handleIncomePress = () => {
    if (navigateToTab) {
      navigateToTab('income');
    }
  };

  const fetchExpenses = async () => {
      if (!currentGroup?.id) {
        setAllExpenses([]);
        return;
      }

      try {
        const allData = await expenseApi.getExpensesByGroupId(currentGroup.id);
        setAllExpenses(allData);
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
        setAllExpenses([]);
      }
    };

    const fetchIncome = async () => {
      if (!currentGroup?.id) {
        setAllIncome([]);
        return;
      }

      try {
        const data = await incomeApi.getIncomesByGroupId(currentGroup.id);
        setAllIncome(data);
      } catch (error) {
        console.error('failed to fetch income: ', error);
        setAllIncome([]);
      } finally {
      }
    };

  useEffect(() => {
    const initialState = async () => {
      pageOpacity.setValue(0);
      setLoading(true);
      await fetchIncome();
      await fetchExpenses();
      
      setLoading(false);
      setTimeout(() => {
        Animated.timing(pageOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 75);
    };
    
    initialState();
    

  }, [currentGroup?.id]); 


  const onRefresh = async () => {
    Animated.timing(pageOpacity, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();

    setRefreshing(true);
    await fetchExpenses();
    await fetchIncome();
    setRefreshing(false)
    Animated.timing(pageOpacity, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }

  const currentMonthExpenses = useMemo(() => {
    return filterExpensesByMonth(allExpenses, selectedMonth, selectedYear);
  }, [allExpenses, selectedMonth, selectedYear]);

  const currentMonthIncome = useMemo(() => {
    return filterIncomeByMonth(allIncome, selectedMonth, selectedYear);
  }, [allExpenses, selectedMonth, selectedYear]);

  const previousMonthExpenses = useMemo(() => {
    const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
    const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
    return filterExpensesByMonth(allExpenses, prevMonth, prevYear);
  }, [allExpenses, selectedMonth, selectedYear]);

  const previousMonthIncome = useMemo(() => {
    const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
    const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
    return filterIncomeByMonth(allIncome, prevMonth, prevYear);
  }, [allExpenses, selectedMonth, selectedYear]);

  const totalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const previousMonthTotal = previousMonthExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  const totalIncomes = currentMonthIncome.reduce((sum, income) => sum + Number(income.amount), 0);
  const previousMonthTotalIncome = previousMonthIncome.reduce((sum, income) => sum + Number(income.amount), 0);

  const percentChange = useMemo(() => {
    if (previousMonthTotal === 0) {
      return totalExpenses > 0 ? 100 : 0; 
    }
    return ((totalExpenses - previousMonthTotal) / previousMonthTotal) * 100;
  }, [totalExpenses, previousMonthTotal]);

  const percentChangeIncome = useMemo(() => {
    if (previousMonthTotalIncome === 0) {
      return totalIncomes > 0 ? 100 : 0; 
    }
    return ((totalIncomes - previousMonthTotalIncome) / previousMonthTotalIncome) * 100;
  }, [totalExpenses, previousMonthTotal]);

  const latestExpense = useMemo(() => {
    if (allExpenses.length === 0) return undefined;
    
    const sorted = [...allExpenses].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    return {
      title: sorted[0].title,
      amount: sorted[0].amount,
      created_at: sorted[0].created_at.toString()
    };
  }, [allExpenses]);

  const latestIncome = useMemo(() => {
    if (allIncome.length === 0) return undefined;
    
    const sorted = [...allIncome].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    return {
      title: sorted[0].title,
      amount: sorted[0].amount,
      created_at: sorted[0].created_at.toString()
    };
  }, [allIncome]);

  return (
    <ScrollView className='flex-1 bg-background' refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }>
      <Animated.View className="flex-1 bg-background" style={{opacity: pageOpacity}}>
          <View className='m-4 mb-8'>
            <InvestmentSummary portfolioValue={200} investedValue={100} totalGain={100} percentGain={100}/>
          </View>
          <View className='bg-surface border border-slate-300 rounded-xl m-4 mt-0 py-4'>
            <View className="m-4">
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
            <View className='m-4'>
              <IncomeSummary 
                totalIncome={totalIncomes}
                previousMonthIncome={previousMonthTotalIncome}
                percentChange={percentChangeIncome}
                latestIncome={latestIncome}
                handleIncomePress={handleIncomePress}
                currency='€'
              />
            </View>
          </View>
      </Animated.View>
      <View className='absolute w-full mt-8'>
        {loading && (<ActivityIndicator color={'#3B82F6'}/>)}
      </View>
    </ScrollView>
  );
}

export default DashboardScreen;
