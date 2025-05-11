import { useState } from 'react';
import { SafeAreaView, View, Text, Pressable, Modal, FlatList } from 'react-native';
import { Filter, Plus } from 'lucide-react-native';
import AddExpenseForm from '@/../components/expenses/AddExpenseForm';
import FilterExpenses from '@/../components/expenses/FilterExpenses';
import { Expense } from '@/../context/AppContext';

type Filters = {
  month: number | 'all';
  year: number | 'all';
  category: string;
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
};

export default function ExpensesScreen() {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    month: 'all',
    year: 'all',
    category: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const filteredExpenses: Expense[] = [
    { id: '1', description: 'Groceries', date: '2023-05-01', amount: 50.0, category: 'food' },
    { id: '2', description: 'Rent', date: '2023-05-01', amount: 500.0, category: 'housing' },
    { id: '3', description: 'Gym Membership', date: '2023-05-01', amount: 30.0, category: 'health' },
    { id: '4', description: 'Electricity Bill', date: '2023-05-02', amount: 100.0, category: 'utilities' },
    { id: '5', description: 'Internet Bill', date: '2023-05-03', amount: 40.0, category: 'utilities' },
    { id: '6', description: 'Dining Out', date: '2023-05-04', amount: 60.0, category: 'food' },
    { id: '7', description: 'Car Fuel', date: '2023-05-05', amount: 70.0, category: 'transportation' },
    { id: '8', description: 'Movie Tickets', date: '2023-05-06', amount: 25.0, category: 'entertainment' },
    { id: '9', description: 'Clothing', date: '2023-05-07', amount: 120.0, category: 'entertainment' },
    { id: '11', description: 'Phone Bill', date: '2023-05-09', amount: 30.0, category: 'utilities' },
    { id: '12', description: 'Coffee', date: '2023-05-10', amount: 15.0, category: 'food' },
  ];

  const renderHeader = () => (
    <View className="p-4 mt-3">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row gap-x-2">
          <Pressable
            onPress={() => setShowFilters(true)}
            className="flex-row items-center bg-cyan-100 px-3 py-2 rounded-md"
          >
            <Filter size={20} color="#0891b2" />
            <Text className="ml-2 text-cyan-600 font-medium">Filter</Text>
          </Pressable>
          <Pressable
            onPress={() => setShowAddExpense(true)}
            className="flex-row items-center bg-cyan-600 px-3 py-2 rounded-md"
          >
            <Plus size={20} color="#fff" />
            <Text className="ml-2 text-white font-medium">Add expense</Text>
          </Pressable>
        </View>
      </View>

      {/* Summary */}
      <View className="flex-row justify-between bg-white rounded-xl p-4 mb-4 shadow">
        <Text className="text-base font-medium text-slate-700">Total:</Text>
        <Text className="text-lg font-bold text-slate-900">
          {filteredExpenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)} €
        </Text>
      </View>
    </View>
  );

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <View className="bg-slate-50 rounded-lg p-4 mb-4 shadow">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-lg font-medium text-slate-900">{item.description}</Text>
          <Text className="text-sm text-slate-500">{item.date}</Text>
        </View>
        <Text className="text-lg font-bold text-red-500">{item.amount.toFixed(2)} €</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <FlatList
        showsVerticalScrollIndicator={false}
        data={filteredExpenses}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={renderExpenseItem}
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      {/* Modals */}
      <Modal visible={showAddExpense} animationType="slide" transparent onRequestClose={() => setShowAddExpense(false)}>
        <AddExpenseForm onClose={() => setShowAddExpense(false)} />
      </Modal>
      <Modal visible={showFilters} animationType="slide" transparent onRequestClose={() => setShowFilters(false)}>
        <FilterExpenses filters={filters} onFiltersChange={setFilters} onClose={() => setShowFilters(false)} />
      </Modal>
    </SafeAreaView>
  );
}