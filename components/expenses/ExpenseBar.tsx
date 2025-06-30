import React from 'react';
import { View, Text } from 'react-native';
import { getCategoryColor } from '../../utils/categoryColors';
import { ExpenseCategory } from '../../types/expense';
import { Expense } from '../../types/expense';

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

  const categoryData = getCategoryData();
  const categories = Object.keys(categoryData);
  const values = Object.values(categoryData);

  if (categories.length === 0 || values.every((val) => val === 0 || isNaN(val))) {
    return (
      <View className="bg-white rounded-lg p-4 m-4">
        <Text className="text-lg font-bold text-center mb-4">Expenses by Category</Text>
        <View className="h-12 bg-gray-200 rounded-lg items-center justify-center">
          <Text className="text-gray-500">No valid expenses yet</Text>
        </View>
      </View>
    );
  }

  const total = values.reduce((sum, val) => sum + (isNaN(val) ? 0 : val), 0);

  if (total === 0 || isNaN(total)) {
    return (
      <View className="bg-white rounded-lg p-4 m-4">
        <Text className="text-lg font-bold text-center mb-4">Expenses by Category</Text>
        <View className="h-12 bg-gray-200 rounded-lg items-center justify-center">
          <Text className="text-gray-500">No expenses to display</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-xl px-4 mx-4 py-3 mb-5 border border-slate-200">
      <Text className="text-lg font-semibold text-center mb-6 mt-1 text-slate-800">
        Expenses by Category
      </Text>
      <View className="flex-row h-8 rounded-lg overflow-hidden mb-4 bg-gray-200">
        {categories.map((category) => {
          const value = categoryData[category];
          const percentage = (value / total) * 100;

          if (isNaN(percentage) || percentage <= 0) {
            return null;
          }

          return (
            <View
              key={category}
              className="h-full"
              style={{
                backgroundColor: getCategoryColor(category as ExpenseCategory),
                width: `${Math.min(100, Math.max(0, percentage))}%`,
              }}
            />
          );
        })}
      </View>

      <View className="mt-4">
        {categories.map((category) => {
          const value = categoryData[category];
          const percentage = (value / total) * 100;

          if (isNaN(value) || isNaN(percentage) || value <= 0) {
            return null;
          }

          return (
            <View key={category} className="flex-row items-center mb-2">
              <View
                className="w-4 h-4 rounded mr-3"
                style={{ backgroundColor: getCategoryColor(category as ExpenseCategory) }}
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
