import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Animated,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import Modal from 'react-native-modal';
import { Expense, ExpenseCategory, useAppStore } from '@/../context/AppContext';
import SelectTimeFrame from 'components/common/SelectTimeFrame';
import AddExpense from '@/../components/expenses/AddExpense';
import { expenseApi } from '../../api/expenses';
import { useGroups } from '@/../context/AppContext';
import ExpenseBar from 'components/expenses/ExpenseBar';
import Header from 'components/expenses/Header';
import { getExpenseCategoryColor } from 'utils/categoryColors';

const timeWindowOptions = [
  { label: 'Today', value: 'today' },
  { label: '7 days', value: '7 days' },
  { label: 'Month', value: 'this_month' },
  { label: 'Year', value: 'last_year' },
];

export default function ExpensesScreen() {
  const { expenses, setExpenses } = useAppStore();
  const [selectedTimeWindow, setSelectedTimeWindow] = useState(timeWindowOptions[1].value);
  const [selectedCategories, setSelectedCategories] = useState<ExpenseCategory[]>([]);
  const [selectedCategoryBubbles, setSelectedCategoryBubbles] = useState<ExpenseCategory[]>([]);
  const [showTimeWindowPicker, setShowTimeWindowPicker] = useState(false);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [listOpacity] = useState(new Animated.Value(1));
  const [pageOpacity] = useState(new Animated.Value(1));

  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  const { currentGroup } = useGroups();
  const currentGroupId = currentGroup?.id;
  const [loading, setLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const fetchExpenses = async () => {
        setLoading(true);
        pageOpacity.setValue(0);
        try {
          if (!currentGroupId) {
            console.warn('No current group selected');
            return;
          }
          const expenses = await expenseApi.getExpensesByGroupId(currentGroupId);
          console.log('Fetched expenses:', expenses);
          setExpenses(expenses);
          const categories = Array.from(
            new Set(expenses.map((expense) => expense.category).filter(Boolean)),
          ) as ExpenseCategory[];
          setCategories(categories);
          console.log('Fetched categories:', categories);
        } catch (error) {
          console.error('Failed to fetch expenses:', error);
        } finally {
          setLoading(false);
          Animated.timing(pageOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      };
  const updateExpenses = useCallback(async () => {
    Animated.timing(listOpacity, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();

    if (!currentGroupId) {
      console.warn('No current group selected');
      return;
    }
    const expenses = await expenseApi.getExpensesByGroupId(currentGroupId);

    setExpenses(expenses);
    const categories = Array.from(
      new Set(expenses.map((expense) => expense.category).filter(Boolean)),
    ) as ExpenseCategory[];
    setCategories(categories);
    Animated.timing(listOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [currentGroupId, setExpenses]);



  useEffect(() => {
    fetchExpenses();
  }, [currentGroupId]);


  const onRefresh = async () => {
    setRefreshing(true);
    await updateExpenses();
    setRefreshing(false);
  };

  const handleTimeWindowChange = (value: string) => {
    Animated.timing(listOpacity, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setSelectedTimeWindow(value);
      setShowTimeWindowPicker(false);

      Animated.timing(listOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const scrollViewStyle = useMemo(() => ({ paddingHorizontal: 2 }), []);

  const filteredExpenses = useMemo(() => {
    const getTimeLimit = (timeWindow: string): number => {
      const DAY = 24 * 60 * 60 * 1000;
      const limits = {
        today: DAY,
        week: 7 * DAY,
        month: 30 * DAY,
        year: 365 * DAY,
        all: Infinity,
      };
      return limits[timeWindow as keyof typeof limits] || Infinity;
    };

    return expenses.filter((expense) => {
      const categoryMatch =
        selectedCategories.length === 0 ||
        (expense.category && selectedCategories.includes(expense.category as ExpenseCategory));
      const expenseDate = new Date(expense.created_at);
      const timeDiff = Date.now() - expenseDate.getTime();
      const timeMatch = timeDiff <= getTimeLimit(selectedTimeWindow);

      return categoryMatch && timeMatch;
    });
  }, [expenses, selectedCategories, selectedTimeWindow]);


  const handleCategorySelect = useCallback(
    (category: ExpenseCategory) => {
      setSelectedCategoryBubbles((prevSelected) =>
          prevSelected.includes(category)
            ? prevSelected.filter((c) => c !== category)
            : [...prevSelected, category],
        );
      Animated.timing(listOpacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        setSelectedCategories((prevSelected) =>
          prevSelected.includes(category)
            ? prevSelected.filter((c) => c !== category)
            : [...prevSelected, category],
        );
        Animated.timing(listOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    },
    [listOpacity],
  );

  

  const RenderExpenseItem = useCallback(
    ({ item }: { item: Expense }) => {
      const createdDate = item.created_at instanceof Date 
      ? item.created_at 
      : new Date(item.created_at);

      return (
      <View className="bg-surface rounded-xl p-4 my-2 mx-4 mt-0 border border-slate-200">
        <View className="flex-row justify-between items-center">
          <View className='flex-row justify-center items-center'>
            <View className='w-3 h-3 rounded-full mr-3' style={{backgroundColor: getExpenseCategoryColor(item.category as ExpenseCategory)}}/>
            <View className='flex-col gap-0'>
              <Text className="text-lg font-medium font-semibold text-default">
                {item.title || item.description}
              </Text>
              
              <Text className="text-sm text-muted capitalize font-sans">{item.category || 'other'}</Text>
            
            </View>
          </View>
          <View className="flex-col gap-0">
            <Text className="text-lg font-bold text-danger">
              {(Number(item.amount) || 0).toFixed(2)} €
            </Text>
            <Text className='text-sm text-muted font-sans text-right'>
              {createdDate.toLocaleDateString('en-GB', {
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
          
        </View>
      </View>)
    },
    [],
  );

  return (
    <View className='flex-1 m-0'>
    <Animated.ScrollView
      className="flex-1 bg-background pt-4" 
      keyboardShouldPersistTaps='always'
      style={{opacity: pageOpacity}}
      refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }>
      <Header
        selectedTimeWindow={selectedTimeWindow}
        showTimeWindowPicker={showTimeWindowPicker}
        filteredExpenses={filteredExpenses}
        setShowTimeWindowPicker={setShowTimeWindowPicker}
        setShowAddExpenseModal={setShowAddExpenseModal}
        timeWindowOptions={timeWindowOptions}
      />

      
        <>
          <Animated.View style={{}} className="mt-0 mb-6 pl-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={scrollViewStyle}
              persistentScrollbar={false}
              keyboardShouldPersistTaps='always'>
              
              {categories.map((category) => {
                const isSelected = selectedCategoryBubbles.includes(category);
                return (
                  <Pressable
                    key={category}
                    onPress={() => handleCategorySelect(category)}
                    className={`px-4 py-2 rounded-full mr-2 border
                    ${isSelected ? 'bg-[#3B82F6] border-[#3B82F6]' : 'bg-white border-slate-200'}`}
                  >
                    <Text
                      className={`text-sm font-medium font-sans
                      ${isSelected ? 'text-white' : 'text-muted'}`}
                    >
                      {category}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Animated.View>

          <Animated.View style={{ flex: 1, opacity: listOpacity }}>
            <ExpenseBar expenses={filteredExpenses} />
            <View className="pb-5">
              {filteredExpenses.map((expense, index) => (
                <RenderExpenseItem key={index} item={expense} />
              ))}
            </View>
          </Animated.View>
        </>

      <Modal
        isVisible={showAddExpenseModal}
        onSwipeComplete={() => setShowAddExpenseModal(false)}
        swipeDirection="down"
        animationIn="fadeIn"
        animationOut="fadeOut"
        onBackdropPress={() => setShowAddExpenseModal(false)}
        style={{ justifyContent: 'flex-end', margin: 0 }}
        statusBarTranslucent={true}
        backdropOpacity={0.5}
      >
        <AddExpense onClose={() => setShowAddExpenseModal(false)} updateExpenses={updateExpenses} />
      </Modal>

      <Modal
        isVisible={showTimeWindowPicker}
        onSwipeComplete={() => setShowTimeWindowPicker(false)}
        swipeDirection="down"
        animationIn="fadeIn"
        animationOut="fadeOut"
        onBackdropPress={() => setShowTimeWindowPicker(false)}
        style={{ justifyContent: 'flex-end', margin: 0 }}
        statusBarTranslucent={true}
        backdropOpacity={0.5}
      >
        <SelectTimeFrame
          setShowTimeWindowPicker={setShowTimeWindowPicker}
          selectedTimeWindow={selectedTimeWindow}
          handleTimeWindowChange={handleTimeWindowChange}
          timeWindowOptions={timeWindowOptions}
        />
      </Modal>
    </Animated.ScrollView>
    {loading && (
      <View className='absolute w-full mt-8'>
        <ActivityIndicator color={'#3B82F6'} />
      </View>)}
    </View>
    
  );
}
