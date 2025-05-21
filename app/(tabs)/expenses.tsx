import { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, ScrollView } from 'react-native';
import { Plus, ChevronDown } from 'lucide-react-native';
import AddExpenseForm from '@/../components/expenses/AddExpenseForm';
import { Expense, ExpenseCategory, useAppContext } from '@/../context/AppContext'; // <<<--- LISÄÄ useAppContext
import SelectTimeFrame from '@/../components/expenses/SelectTimeFrame';

const timeWindowOptions = [
  { label : 'Today', value: 'today' },
  { label: '7 days', value: '7 days' },
  { label: 'Month', value: 'this_month' },
  { label: 'Year', value: 'last_year' },
];

const allCategories: ExpenseCategory[] = [
  'food',
  'housing',
  'transportation',
  'entertainment',
  'utilities',
  'health',
  'clothing',
  'other',
];

export default function ExpensesScreen() {
  const { showTimeWindowPicker, setShowTimeWindowPicker } = useAppContext(); 
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedTimeWindow, setSelectedTimeWindow] = useState(timeWindowOptions[0].value);
  const [selectedCategories, setSelectedCategories] = useState<ExpenseCategory[]>([]);

  const filteredExpenses: Expense[] = [
    // ... placeholder data ...
    { id: '1', description: 'Groceries', date: '2023-05-01', amount: 50.0, category: 'food' },
    { id: '2', description: 'Rent', date: '2023-05-01', amount: 500.0, category: 'housing' },
    { id: '3', description: 'Gym Membership', date: '2023-05-01', amount: 30.0, category: 'health'},
    { id: '4', description: 'Electricity Bill', date: '2023-05-02', amount: 100.0, category: 'utilities'},
    { id: '5', description: 'Internet Bill', date: '2023-05-03', amount: 40.0, category: 'utilities'},
    { id: '6', description: 'Dining Out', date: '2023-05-04', amount: 60.0, category: 'food' },
    { id: '7', description: 'Car Fuel', date: '2023-05-05', amount: 70.0, category: 'transportation'},
    { id: '8', description: 'Movie Tickets', date: '2023-05-06', amount: 25.0, category: 'entertainment'},
    { id: '9', description: 'Clothing', date: '2023-05-07', amount: 120.0, category: 'entertainment'},
    { id: '11', description: 'Phone Bill', date: '2023-05-09', amount: 30.0, category: 'utilities'},
    { id: '12', description: 'Coffee', date: '2023-05-10', amount: 15.0, category: 'food' },
  ];

  const handleTimeWindowChange = (value: string) => {
    setSelectedTimeWindow(value);
    setShowTimeWindowPicker(false); 
    console.log('Selected Time Window:', value);
  };

  const handleCategorySelect = (category: ExpenseCategory) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((c) => c !== category)
        : [...prevSelected, category]
    );
  };

  const renderHeader = () => (
    <View className="p-0 mt-10" style={{ zIndex: 10 }}>
      <View className="flex-row items-center mb-6 justify-between px-4">
        <View className="relative" style={{ zIndex: 1 }}>
          <View className="flex-row items-center bg-white rounded-xl shadow" >
            <Pressable
              onPress={() => {
                setShowTimeWindowPicker(!showTimeWindowPicker);
              }}
              style={{ width: 100, paddingHorizontal: 20, justifyContent: 'space-between' }}
              className="flex-row items-center pr-2 border-r border-slate-200 text-center"
            >
              <Text className="font-medium text-slate-600 pr-2">
                {timeWindowOptions.find(opt => opt.value === selectedTimeWindow)?.label}
              </Text>
              <View className="mr-2">
                <ChevronDown size={16} color="#64748b" />
              </View>
            </Pressable>
            <View className="p-3 pl-2">
              <Text className="font-bold text-DEFAULT pl-2 pr-2">
                {filteredExpenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)} €
              </Text>
            </View>
          </View>
        </View>
        <Pressable
          onPress={() => setShowAddExpense(true)}
          className="flex-row items-center bg-primary px-3 py-3 rounded-3xl"
        >
          <Plus size={25} color="#fff" />
        </Pressable>
      </View>

      <View className="mt-4 mb-6 pl-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 2 }}>
          {allCategories.map((category) => {
            const isSelected = selectedCategories.includes(category);
            return (
              <Pressable
                key={category}
                onPress={() => handleCategorySelect(category)}
                className={`px-4 py-2 rounded-full mr-2 border
                  ${isSelected ? 'bg-[#3B82F6] border-[#3B82F6]' : 'bg-white border-slate-300'}`}
              >
                <Text
                  className={`text-sm font-medium
                    ${isSelected ? 'text-white' : 'text-slate-700'}`}
                >
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <View className="bg-surface rounded-lg p-4 my-2 mx-4 mt-0 shadow">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-lg font-medium text-DEFAULT">{item.description}</Text>
          <Text className="text-sm text-mute">{item.date}</Text>
        </View>
        <Text className="text-lg font-bold text-danger">{item.amount.toFixed(2)} €</Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-background pt-6">
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={renderExpenseItem}
        contentContainerStyle={{ paddingBottom: 16 }}
        onScrollBeginDrag={() => {
          if (showTimeWindowPicker) { //
            setShowTimeWindowPicker(false); //
          }
        }}
        extraData={selectedCategories}
      />

      <Modal
        visible={showAddExpense}
        animationType="fade"
        transparent
        onRequestClose={() => setShowAddExpense(false)}
      >
        <AddExpenseForm onClose={() => setShowAddExpense(false)} />
      </Modal>

      <Modal
        visible={showTimeWindowPicker} 
        animationType="fade"
        transparent
        onRequestClose={() => setShowTimeWindowPicker(false)} 
      >
        <SelectTimeFrame
          setShowTimeWindowPicker={setShowTimeWindowPicker}
          selectedTimeWindow={selectedTimeWindow}
          handleTimeWindowChange={handleTimeWindowChange}
          timeWindowOptions={timeWindowOptions}
        />
      </Modal>
    </View>
  );
}
