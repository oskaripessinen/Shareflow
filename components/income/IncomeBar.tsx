import React from 'react';
import { View, Text } from 'react-native';
import { Income } from '@/../context/AppContext';

interface IncomeBarProps {
  incomes: Income[];
}

const IncomeBar: React.FC<IncomeBarProps> = ({ incomes }) => {
  const getCategoryData = () => {
    const categoryTotals: Record<string, number> = incomes.reduce(
      (acc, income) => {
        const category = income.category || 'other';
        const amount = typeof income.amount === 'number'
          ? income.amount
          : parseFloat(String(income.amount)) || 0;

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
          <Text className="text-gray-500">No valid incomes for this timeframe</Text>
        </View>
      </View>
    );
  }

  const total = values.reduce((sum, val) => sum + (isNaN(val) ? 0 : val), 0);

  if (total === 0 || isNaN(total)) {
    return (
      <View className="bg-white rounded-xl p-4 m-4">
        <Text className="text-lg font-bold text-center mb-4">Income by Category</Text>
        <View className="h-12 bg-gray-200 rounded-lg items-center justify-center">
          <Text className="text-gray-500">No incomes to display</Text>
        </View>
      </View>
    );
  }

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      salary: '#10B981',
      freelance: '#06B6D4',
      investments: '#8B5CF6',
      business: '#F59E0B',
      gifts: '#EF4444',
      other: '#6B7280',
    };
    return colors[category] || '#6B7280';
  };

  return (
    <View className="bg-white rounded-xl px-4 mx-4 py-3 mb-5 border border-slate-200">
      <Text className="text-lg font-semibold text-center mb-6 mt-1 text-slate-800">
        Income by Category
      </Text>
      <View className="flex-row h-8 rounded-lg overflow-hidden mb-4 bg-gray-200">
        {categories.map((category) => {
          const value = sortedCategoryData[category];
          const percentage = (value / total) * 100;

          if (isNaN(percentage) || percentage <= 0) {
            return null;
          }

          return (
            <View
              key={category}
              className="h-full"
              style={{
                backgroundColor: getCategoryColor(category),
                width: `${Math.min(100, Math.max(0, percentage))}%`,
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
                style={{ backgroundColor: getCategoryColor(category) }}
              />
              <Text className="flex-1 text-default capitalize font-semibold text-base">
                {category}
              </Text>
              <Text className="text-default font-semibold text-sm">
                +{value.toFixed(2)} €
              </Text>
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

export default IncomeBar;