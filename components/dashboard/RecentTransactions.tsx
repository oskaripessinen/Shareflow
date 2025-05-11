import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Expense } from '@/../context/AppContext';
import { formatDate } from '@/../utils/dateUtils';

interface RecentTransactionsProps {
  transactions: Expense[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  // Category icons or colors
  const categoryInfo = {
    food: { color: '#0891b2', label: 'Ruoka' },  // Cyan-600
    housing: { color: '#0284c7', label: 'Asuminen' }, // Sky-600
    transportation: { color: '#14b8a6', label: 'Liikenne' }, // Teal-500
    entertainment: { color: '#8b5cf6', label: 'Viihde' }, // Violet-500
    utilities: { color: '#f59e0b', label: 'Laskut' }, // Amber-500
    health: { color: '#10b981', label: 'Terveys' }, // Emerald-500
    clothing: { color: '#ec4899', label: 'Vaatteet' }, // Pink-500
    other: { color: '#6b7280', label: 'Muut' }, // Gray-500
  };

  const renderTransaction = ({ item }: { item: Expense }) => {
    const categoryColor = categoryInfo[item.category as keyof typeof categoryInfo]?.color || '#6b7280';
    const categoryLabel = categoryInfo[item.category as keyof typeof categoryInfo]?.label || 'Muut';
    
    return (
      <View style={styles.transactionItem}>
        <View style={[styles.categoryIndicator, { backgroundColor: categoryColor }]} />
        <View style={styles.transactionDetails}>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.category}>{categoryLabel}</Text>
        </View>
        <View style={styles.transactionMeta}>
          <Text style={styles.amount}>-{item.amount.toFixed(2)} €</Text>
          <Text style={styles.date}>{formatDate(item.date)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No recent transactions</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0', // Slate-200
  },
  categoryIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a', // Slate-900
    marginBottom: 2,
  },
  category: {
    fontSize: 14,
    color: '#64748b', // Slate-500
  },
  transactionMeta: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444', // Red-500
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    color: '#64748b', // Slate-500
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b', // Slate-500
  },
});