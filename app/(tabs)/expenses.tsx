import React, { useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Filter } from 'lucide-react-native';
import { useAppContext } from '@/../context/AppContext';
import ExpenseList from '@/../components/expenses/ExpenseList';
import AddExpenseForm from '@/../components/expenses/AddExpenseForm';
import FilterExpenses from '@/../components/expenses/FilterExpenses';
import { getCurrentMonth, getCurrentYear } from '@/../utils/dateUtils';

export default function ExpensesScreen() {
  const { expenses } = useAppContext();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    month: getCurrentMonth(),
    year: getCurrentYear(),
    category: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // Apply filters to expenses
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const matchesMonth = filters.month === 'all' || expenseDate.getMonth() === filters.month - 1;
    const matchesYear = filters.year === 'all' || expenseDate.getFullYear() === filters.year;
    const matchesCategory = filters.category === 'all' || expense.category === filters.category;

    return matchesMonth && matchesYear && matchesCategory;
  }).sort((a, b) => {
    if (filters.sortBy === 'date') {
      return filters.sortOrder === 'desc'
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (filters.sortBy === 'amount') {
      return filters.sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
    }
    return 0;
  });

  return (
    <SafeAreaView className="flex-1 bg-slate-50 p-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold text-slate-900">Expenses</Text>
        <View className="flex-row space-x-2">
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
        <Text className="text-base font-medium text-slate-700">total:</Text>
        <Text className="text-lg font-bold text-slate-900">
          {filteredExpenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)} €
        </Text>
      </View>

      {/* Tämä vie jäljellä olevan tilan ja hoitaa skrollauksen */}
      <View className="flex-1">
        <ExpenseList expenses={filteredExpenses} />
      </View>

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