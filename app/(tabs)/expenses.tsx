import { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Expense, ExpenseCategory, useAppStore } from '@/../context/AppContext';
import SelectTimeFrame from '@/../components/expenses/SelectTimeFrame';
import AddExpense from '@/../components/expenses/AddExpense';
import { expenseApi } from '../../api/expenses';
import { useGroupStore } from '@/../context/AppContext';
import ExpenseBar from 'components/expenses/ExpenseBar';
import Header from 'components/expenses/Header';

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
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  const currentGroupId = useGroupStore((state) => state.currentGroup?.id);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchExpenses = async () => {
        setLoading(true);
        listOpacity.setValue(0);
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
          Animated.timing(listOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      };

      fetchExpenses();
    }, []),
  );

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
      <View className="bg-surface rounded-xl py-3 px-4 my-2 mx-4 mt-0 border border-slate-200">
        <View className="flex-row justify-between items-center">
          <View className='flex-col gap-2'>
            <Text className="text-lg font-medium font-semibold text-default">
              {item.title || item.description}
            </Text>
            
            <Text className="text-sm text-muted capitalize font-sans">{item.category || 'other'}</Text>
           
          </View>
          <View className="flex-col gap-2">
            <Text className="text-lg font-bold text-danger">
              {(Number(item.amount) || 0).toFixed(2)} €
            </Text>
            <Text className='text-sm text-muted font-sans text-right'>
              {createdDate.toLocaleDateString('en-GB', {
                month: 'short',
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
    <ScrollView className="flex-1 bg-background pt-4">
      <Header
        selectedTimeWindow={selectedTimeWindow}
        showTimeWindowPicker={showTimeWindowPicker}
        filteredExpenses={filteredExpenses}
        setShowTimeWindowPicker={setShowTimeWindowPicker}
        setShowAddExpenseModal={setShowAddExpenseModal}
        timeWindowOptions={timeWindowOptions}
      />

      {loading ? (
        <ActivityIndicator color="grey" />
      ) : (
        <>
          <View className="mt-0 mb-6 pl-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={scrollViewStyle}
              persistentScrollbar={false}
            >
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
          </View>

          <Animated.View style={{ opacity: listOpacity, flex: 1 }}>
            <ExpenseBar expenses={filteredExpenses} />
            <View className="pb-5">
              {filteredExpenses.map((expense, index) => (
                <RenderExpenseItem key={index} item={expense} />
              ))}
            </View>
          </Animated.View>
        </>
      )}

      <Modal
        visible={showAddExpenseModal}
        animationType="fade"
        presentationStyle="overFullScreen"
        backdropColor="transparent"
        statusBarTranslucent={true}
      >
        <AddExpense onClose={() => setShowAddExpenseModal(false)} updateExpenses={updateExpenses} />
      </Modal>

      <Modal
        visible={showTimeWindowPicker}
        animationType="fade"
        onRequestClose={() => setShowTimeWindowPicker(false)}
        presentationStyle="overFullScreen"
        backdropColor="transparent"
        statusBarTranslucent={true}
      >
        <SelectTimeFrame
          setShowTimeWindowPicker={setShowTimeWindowPicker}
          selectedTimeWindow={selectedTimeWindow}
          handleTimeWindowChange={handleTimeWindowChange}
          timeWindowOptions={timeWindowOptions}
        />
      </Modal>
    </ScrollView>
  );
}
