import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Animated,
  ActivityIndicator,
  RefreshControl,
  Platform
} from 'react-native';
import Modal from 'react-native-modal';
import { Income, IncomeCategory, useAppStore } from '@/../context/AppContext';
import SelectTimeFrame from '@/../components/common/SelectTimeFrame';
import AddIncomeForm from '@/../components/income/AddIncomeForm';
import { incomeApi } from '../../api/income';
import { useGroups } from '@/../context/AppContext';
import IncomeBar from 'components/income/IncomeBar';
import Header from 'components/income/Header';

const timeWindowOptions = [
  { label: 'Today', value: 'today' },
  { label: '7 days', value: '7 days' },
  { label: 'Month', value: 'this_month' },
  { label: 'Year', value: 'last_year' },
];

export default function IncomeScreen() {
  const { incomes, setIncomes } = useAppStore();
  const [selectedTimeWindow, setSelectedTimeWindow] = useState(timeWindowOptions[1].value);
  const [selectedCategories, setSelectedCategories] = useState<IncomeCategory[]>([]);
  const [selectedCategoryBubbles, setSelectedCategoryBubbles] = useState<IncomeCategory[]>([]);
  const [showTimeWindowPicker, setShowTimeWindowPicker] = useState(false);
  const [categories, setCategories] = useState<IncomeCategory[]>([]);
  const [listOpacity] = useState(new Animated.Value(1));
  const [pageOpacity] = useState(new Animated.Value(1));
  const [showAddIncomeForm, setShowAddIncomeForm] = useState(false);

  const { currentGroup } = useGroups();

  const currentGroupId = currentGroup?.id;
  const [loading, setLoading] = useState(false);

   const [refreshing, setRefreshing] = useState(false);

  const fetchIncomes = async () => {
      setLoading(true);
      pageOpacity.setValue(0);
      try {
        if (!currentGroupId) {
          console.warn('No current group selected');
          return;
        }
        const incomes = await incomeApi.getIncomesByGroupId(currentGroupId);
        console.log('Fetched incomes:', incomes);
        setIncomes(incomes);
        const categories = Array.from(
          new Set(incomes.map((income) => income.category).filter(Boolean)),
        ) as IncomeCategory[];
        setCategories(categories);
        console.log('Fetched categories:', categories);
      } catch (error) {
        console.error('Failed to fetch incomes:', error);
      } finally {
        setLoading(false);
        Animated.timing(pageOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    };
  

  const onRefresh = async () => {
    setRefreshing(true);
    await updateIncomes();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchIncomes();
  }, [currentGroupId]);

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

  const handleCloseForm = () => {
    setShowAddIncomeForm(false);
    updateIncomes?.();
  };

  const scrollViewStyle = useMemo(() => ({ paddingHorizontal: 2 }), []);

  const filteredIncomes = useMemo(() => {
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

    return incomes.filter((income) => {
      const categoryMatch =
        selectedCategories.length === 0 ||
        (income.category && selectedCategories.includes(income.category as IncomeCategory));
      const incomeDate = new Date(income.created_at);
      const timeDiff = Date.now() - incomeDate.getTime();
      const timeMatch = timeDiff <= getTimeLimit(selectedTimeWindow);

      return categoryMatch && timeMatch;
    });
  }, [incomes, selectedCategories, selectedTimeWindow]);

  const updateIncomes = useCallback(async () => {
    Animated.timing(listOpacity, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();

    if (!currentGroupId) {
      console.warn('No current group selected');
      return;
    }
    const incomes = await incomeApi.getIncomesByGroupId(currentGroupId);

    setIncomes(incomes);
    const categories = Array.from(
      new Set(incomes.map((income) => income.category).filter(Boolean)),
    ) as IncomeCategory[];
    setCategories(categories);
    Animated.timing(listOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [currentGroupId, setIncomes]);

  const handleCategorySelect = useCallback(
    (category: IncomeCategory) => {
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

  const RenderIncomeItem = useCallback(
    ({ item }: { item: Income }) => {
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
            <Text className="text-lg font-bold text-green-600">
              +{(Number(item.amount) || 0)} €
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
    <View className='flex-1'>
      <Animated.ScrollView 
        className="flex-1 bg-background pt-4"
        bounces={true}
        alwaysBounceVertical={true}
        style={{opacity: pageOpacity}}
        overScrollMode={Platform.OS === 'android' ? 'always' : undefined}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyboardShouldPersistTaps='always'>
        <Header
          selectedTimeWindow={selectedTimeWindow}
          showTimeWindowPicker={showTimeWindowPicker}
          filteredIncomes={filteredIncomes}
          setShowTimeWindowPicker={setShowTimeWindowPicker}
          setShowAddIncomeForm={setShowAddIncomeForm}
          timeWindowOptions={timeWindowOptions}
        />

          <>
            <View className="mt-0 mb-6 pl-4">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={scrollViewStyle}
                persistentScrollbar={false}
                keyboardShouldPersistTaps='always'

              >
                {categories.map((category) => {
                  const isSelected = selectedCategoryBubbles.includes(category);
                  return (
                    <Pressable
                      key={category}
                      onPress={() => handleCategorySelect(category)}
                      className={`px-4 py-2 rounded-full mr-2 border
                      ${isSelected ? 'bg-primary border-primary' : 'bg-white border-slate-200'}`}
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

            <Animated.View style={{flex: 1, opacity: listOpacity}}>
              <IncomeBar incomes={filteredIncomes} />
              <View className="pb-5">
                {filteredIncomes.map((income, index) => (
                  <RenderIncomeItem key={index} item={income} />
                ))}
              </View>
            </Animated.View>
          </>

        <Modal
          isVisible={showAddIncomeForm}
          animationIn={'fadeIn'}
          animationOut={'fadeOut'}
          presentationStyle="overFullScreen"
          statusBarTranslucent
          onBackdropPress={() => setShowAddIncomeForm(false)}
          style={{ justifyContent: 'flex-end', margin: 0 }}
        >
          <AddIncomeForm
            onClose={handleCloseForm}
            onIncomeAdded={updateIncomes}
          />
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
      <View className='absolute w-full mt-8'>
        {loading && (
          <ActivityIndicator color={'#3B82F6'} />)}
      </View>   
    </View>
  );
}
