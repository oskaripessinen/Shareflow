import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Expense } from '@/../context/AppContext';
import { formatDate } from '@/../utils/dateUtils';
import { Edit, Trash } from 'lucide-react-native';
import { useAppContext } from '@/../context/AppContext';

interface ExpenseListProps {
  expenses: Expense[];
}

export default function ExpenseList({ expenses }: ExpenseListProps) {
  const { deleteExpense } = useAppContext();

  // Category information with colors and labels
  const categoryInfo = {
    food: { color: '#0891b2', label: 'Food' },  // Cyan-600
    housing: { color: '#0284c7', label: 'Housing' }, // Sky-600
    transportation: { color: '#14b8a6', label: 'Transportation' }, // Teal-500
    entertainment: { color: '#8b5cf6', label: 'Entertaiment' }, // Violet-500
    utilities: { color: '#f59e0b', label: 'Utilities' }, // Amber-500
    health: { color: '#10b981', label: 'Health' }, // Emerald-500
    clothing: { color: '#ec4899', label: 'Clothing' }, // Pink-500
    other: { color: '#6b7280', label: 'Others' }, // Gray-500
  };

  const handleEdit = (expense: Expense) => {
    // Implement edit functionality
    console.log('Edit expense:', expense);
  };

  const handleDelete = (id: string) => {
    deleteExpense(id);
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => {
    const categoryColor = categoryInfo[item.category as keyof typeof categoryInfo]?.color || '#6b7280';
    const categoryLabel = categoryInfo[item.category as keyof typeof categoryInfo]?.label || 'Muut';
    
    return (
      <View style={styles.expenseItem}>
        <View style={styles.expenseMain}>
          <View style={[styles.categoryIndicator, { backgroundColor: categoryColor }]} />
          <View style={styles.expenseDetails}>
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.expenseMeta}>
              <Text style={styles.category}>{categoryLabel}</Text>
              <Text style={styles.date}>{formatDate(item.date)}</Text>
            </View>
          </View>
          <Text style={styles.amount}>{item.amount.toFixed(2)} €</Text>
        </View>
        <View style={styles.actionButtons}>
          <Pressable style={styles.editButton} onPress={() => handleEdit(item)}>
            <Edit size={16} color="#0891b2" />
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
            <Trash size={16} color="#ef4444" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {expenses.length > 0 ? (
        <FlatList
          data={expenses}
          renderItem={renderExpenseItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No expenses on this time period.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  expenseItem: {
    marginBottom: 12,
    backgroundColor: '#f8fafc', // Slate-50
    borderRadius: 8,
    padding: 12,
  },
  expenseMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  expenseDetails: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a', // Slate-900
    marginBottom: 4,
  },
  expenseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: 14,
    color: '#64748b', // Slate-500
    marginRight: 8,
  },
  date: {
    fontSize: 14,
    color: '#94a3b8', // Slate-400
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444', // Red-500
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  editButton: {
    padding: 6,
    backgroundColor: '#e0f2fe', // Cyan-100
    borderRadius: 4,
    marginRight: 8,
  },
  deleteButton: {
    padding: 6,
    backgroundColor: '#fee2e2', // Red-100
    borderRadius: 4,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b', // Slate-500
  },
});