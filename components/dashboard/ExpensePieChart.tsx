import { View, Text, StyleSheet } from 'react-native';
import { Expense } from '@/../context/AppContext';

interface ExpensePieChartProps {
  expenses: Expense[];
}

export default function ExpensePieChart({ expenses }: ExpensePieChartProps) {
  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Calculate total
  const total = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);

  // Get category colors and labels
  const categoryInfo = {
    food: { color: '#0891b2', label: 'Food' },  // Cyan-600
    housing: { color: '#0284c7', label: 'Living' }, // Sky-600
    transportation: { color: '#14b8a6', label: 'Transportation' }, // Teal-500
    entertainment: { color: '#8b5cf6', label: 'Entertainment' }, // Violet-500
    utilities: { color: '#f59e0b', label: 'Utulities' }, // Amber-500
    health: { color: '#10b981', label: 'Health' }, // Emerald-500
    clothing: { color: '#ec4899', label: 'Clothing' }, // Pink-500
    other: { color: '#6b7280', label: 'Other' }, // Gray-500
  };

  // Create data for pie chart
  const chartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    category,
    amount,
    percentage: total > 0 ? (amount / total) * 100 : 0,
    color: categoryInfo[category as keyof typeof categoryInfo]?.color || '#6b7280',
    label: categoryInfo[category as keyof typeof categoryInfo]?.label || 'Muut',
  })).sort((a, b) => b.amount - a.amount);

  // For a simple visual representation, we'll create a circular segments chart
  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {total > 0 ? (
          <View style={styles.pieChart}>
            {chartData.map((item, index) => {
              // Create a simple pie chart using borders
              // This is a simplified version - for production, use a proper charting library
              return (
                <View
                  key={index}
                  style={[
                    styles.pieSegment,
                    {
                      backgroundColor: item.color,
                      width: `${Math.max(8, item.percentage)}%`,
                      height: 20,
                    },
                  ]}
                />
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyChart}>
            <Text style={styles.emptyText}>No expenses during this period</Text>
          </View>
        )}
      </View>

      <View style={styles.legend}>
        {chartData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label}</Text>
            <Text style={styles.legendAmount}>{item.amount.toFixed(0)} €</Text>
            <Text style={styles.legendPercentage}>{item.percentage.toFixed(1)}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  chartContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  pieChart: {
    flexDirection: 'row',
    height: 20,
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  pieSegment: {
    height: 20,
  },
  emptyChart: {
    height: 20,
    width: '100%',
    backgroundColor: '#e2e8f0', // Slate-200
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b', // Slate-500
  },
  legend: {
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a', // Slate-900
  },
  legendAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a', // Slate-900
    marginRight: 8,
    width: 80,
    textAlign: 'right',
  },
  legendPercentage: {
    fontSize: 14,
    color: '#64748b', // Slate-500
    width: 50,
    textAlign: 'right',
  },
});