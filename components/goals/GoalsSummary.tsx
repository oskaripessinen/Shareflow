import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface GoalsSummaryProps {
  savingsTarget: number;
  actualSavings: number;
  savingsProgress: number;
  expenseTarget: number;
  actualExpenses: number;
  expenseProgress: number;
}

export default function GoalsSummary({
  savingsTarget,
  actualSavings,
  savingsProgress,
  expenseTarget,
  actualExpenses,
  expenseProgress,
}: GoalsSummaryProps) {
  const savingsStatus = actualSavings >= savingsTarget ? 'success' : 'pending';
  const expenseStatus = actualExpenses <= expenseTarget ? 'success' : 'warning';

  return (
    <View style={styles.container}>
      <View style={styles.goalItem}>
        <View style={styles.goalHeader}>
          <Text style={styles.goalTitle}>Säästötavoite</Text>
          <Text
            style={[
              styles.goalStatus,
              savingsStatus === 'success' ? styles.successText : styles.pendingText,
            ]}
          >
            {savingsStatus === 'success' ? 'Saavutettu' : 'Kesken'}
          </Text>
        </View>

        <View style={styles.amountContainer}>
          <Text style={styles.actualAmount}>{actualSavings.toFixed(2)} €</Text>
          <Text style={styles.targetAmount}>/ {savingsTarget.toFixed(2)} €</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(100, savingsProgress)}%`,
                  backgroundColor: savingsStatus === 'success' ? '#10b981' : '#0891b2',
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{savingsProgress.toFixed(1)}%</Text>
        </View>
      </View>

      <View style={styles.goalItem}>
        <View style={styles.goalHeader}>
          <Text style={styles.goalTitle}>Menotavoite</Text>
          <Text
            style={[
              styles.goalStatus,
              expenseStatus === 'success' ? styles.successText : styles.warningText,
            ]}
          >
            {expenseStatus === 'success' ? 'Tavoitteessa' : 'Ylitetty'}
          </Text>
        </View>

        <View style={styles.amountContainer}>
          <Text style={styles.actualAmount}>{actualExpenses.toFixed(2)} €</Text>
          <Text style={styles.targetAmount}>/ {expenseTarget.toFixed(2)} €</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(100, expenseProgress)}%`,
                  backgroundColor: expenseStatus === 'success' ? '#10b981' : '#f59e0b',
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{expenseProgress.toFixed(1)}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  goalItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a', // Slate-900
  },
  goalStatus: {
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  successText: {
    color: '#10b981', // Emerald-500
    backgroundColor: '#d1fae5', // Emerald-100
  },
  pendingText: {
    color: '#0891b2', // Cyan-600
    backgroundColor: '#e0f2fe', // Cyan-100
  },
  warningText: {
    color: '#f59e0b', // Amber-500
    backgroundColor: '#fef3c7', // Amber-100
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  actualAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a', // Slate-900
  },
  targetAmount: {
    fontSize: 16,
    color: '#64748b', // Slate-500
    marginLeft: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBackground: {
    flex: 1,
    height: 12,
    backgroundColor: '#e2e8f0', // Slate-200
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b', // Slate-500
    width: 50,
    textAlign: 'right',
  },
});
