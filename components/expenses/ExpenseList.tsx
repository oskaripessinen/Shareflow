import { View, Text, FlatList, Pressable } from 'react-native';
import { Expense } from '@/../context/AppContext';
import { formatDate } from '@/../utils/dateUtils';
import { Edit, Trash } from 'lucide-react-native';
import { useAppStore } from '@/../context/AppContext';

interface ExpenseListProps {
  expenses: Expense[];
}

export default function ExpenseList({ expenses }: ExpenseListProps) {
  const { deleteExpense } = useAppStore();

  const renderExpenseItem = ({ item }: { item: Expense }) => {
    return (
      <View className="bg-slate-50 rounded-lg p-4 mb-4 shadow">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-lg font-medium text-slate-900">{item.description}</Text>
            <Text className="text-sm text-slate-500">{formatDate(item.date)}</Text>
          </View>
          <Text className="text-lg font-bold text-red-500">{item.amount.toFixed(2)} €</Text>
        </View>
        <View className="flex-row justify-end mt-2 space-x-2">
          <Pressable
            className="px-3 py-2 bg-cyan-100 rounded-md"
            onPress={() => console.log('Edit expense:', item)}
          >
            <Edit size={16} color="#0891b2" />
          </Pressable>
          <Pressable
            className="px-3 py-2 bg-red-100 rounded-md"
            onPress={() => deleteExpense(item.id)}
          >
            <Trash size={16} color="#ef4444" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={expenses}
      renderItem={renderExpenseItem}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={() => (
        <View className="p-6 items-center">
          <Text className="text-slate-500">No expenses on this time period.</Text>
        </View>
      )}
    />
  );
}
