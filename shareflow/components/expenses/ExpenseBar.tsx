import React from 'react';
import { View, Text } from 'react-native';
import { getExpenseCategoryColor } from '../../utils/categoryColors';
import { ExpenseCategory } from '../../types/expense';
import { Expense } from '../../types/expense';
import { Layers2 } from 'lucide-react-native';

interface ExpenseBarProps {
  expenses: Expense[];
}

const ExpenseBar: React.FC<ExpenseBarProps> = ({ expenses }) => {
  const getCategoryData = () => {
    const categoryTotals: Record<string, number> = expenses.reduce(
      (acc, expense) => {
        const category = expense.category || 'other';
        const amount =
          typeof expense.amount === 'number'
            ? expense.amount
            : parseFloat(String(expense.amount)) || 0;

        if (!isNaN(amount) && amount > 0) {
          acc[category] = (acc[category] || 0) + amount;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    return categoryTotals;
  };

  const categoryTotals = getCategoryData();
  console.log('Category data:', categoryTotals);

  const sortedCategoryData = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .reduce((acc, [category, amount]) => {
      acc[category] = amount;
      return acc;
    }, {} as Record<string, number>);

  const categories = Object.keys(sortedCategoryData);
  const values = Object.values(sortedCategoryData);

  if (categories.length === 0 || values.every((val) => val === 0 || isNaN(val))) {
    return (
      <View className="bg-white rounded-xl p-4 m-4">
        <View className="h-12 bg-gray-200 rounded-lg items-center justify-center">
          <Text className="text-gray-500">No valid expenses for this timeframe</Text>
        </View>
      </View>
    );
  }

  const total = values.reduce((sum, val) => sum + (isNaN(val) ? 0 : val), 0);

  if (total === 0 || isNaN(total)) {
    return (
      <View className="bg-white rounded-xl p-4 m-4">
        <Text className="text-lg font-bold text-center mb-4">Expenses by Category</Text>
        <View className="h-12 bg-gray-200 rounded-lg items-center justify-center">
          <Text className="text-gray-500">No expenses to display</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-surface px-4 mx-4 py-3 mb-5 border border-slate-200 rounded-xl">
      <View className='flex-row gap-2 mt-1 mb-4 items-center'>
        <Layers2 size={18} strokeWidth={2.2} color='#3B82F6'/>
        <Text className="font-semibold text-center text-default text-lg">
          Expenses breakdown
        </Text>
      </View>
      <View className="flex-row h-7 bg-white mb-2 gap-1 bg-gray-200 justify-center mx-1">
        {categories.map((category) => {
          const value = sortedCategoryData[category];
          const percentage = (value / total) * 100;

          if (isNaN(percentage) || percentage <= 1) {
            return null;
          }

          return (
            <View
              key={category}
              className="h-full rounded-lg"
              style={{
                backgroundColor: getExpenseCategoryColor(category as ExpenseCategory),
                width: `${Math.min(100, Math.max(0, percentage))}%`,
                minWidth: '1.5%'
              }}
            />
          );
        })}
      </View>

      <View className="mt-4">
        {categories.map((category) => {
          const value = sortedCategoryData[category];
          const percentage = (value / total) * 100;

          if (isNaN(value) || isNaN(percentage) || value <= 0) {
            return null;
          }

          return (
            <View key={category} className="flex-row items-center mb-2">
              <View
                className="w-4 h-4 rounded mr-3"
                style={{ backgroundColor: getExpenseCategoryColor(category as ExpenseCategory) }}
              />
              <Text className="flex-1 text-default capitalize font-semibold text-base">{category}</Text>
              <Text className="text-default font-semibold text-sm">{value.toFixed(2)} €</Text>
              <Text className="text-muted text-sm font-sans text-sm ml-2 w-12 text-right">
                {percentage.toFixed(1)}%
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default ExpenseBar;
