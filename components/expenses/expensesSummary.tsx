import React from 'react';
import { View, Text } from 'react-native';
import { TrendingDown, AlertCircle, Calendar } from 'lucide-react-native';

interface ExpenseSummaryProps {
  totalExpenses: number;
  monthlyBudget?: number;
  previousMonthExpenses?: number;
  currency?: string;
}

export default function ExpenseSummary({ 
  totalExpenses, 
  monthlyBudget = 0, 
  previousMonthExpenses = 0,
  currency = "€"
}: ExpenseSummaryProps) {
  const percentageChange = previousMonthExpenses > 0 
    ? ((totalExpenses - previousMonthExpenses) / previousMonthExpenses) * 100 
    : 0;
  
  const budgetUsed = monthlyBudget > 0 ? (totalExpenses / monthlyBudget) * 100 : 0;
  const isOverBudget = budgetUsed > 100;
  
  return (
    <View className="bg-surface rounded-xl p-4 border border-slate-200">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-default">
          Expenses Overview
        </Text>
        <View className="bg-red-100 rounded-full p-2">
          <TrendingDown size={20} color="#ef4444" />
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-2xl font-bold text-slate-900">
          {totalExpenses.toFixed(2)} {currency}
        </Text>
        <Text className="text-sm text-slate-600">
          Total expenses this month
        </Text>
      </View>

      <View className="flex-row justify-between">
        {monthlyBudget > 0 && (
          <View className="flex-1 mr-2">
            <View className="flex-row items-center mb-1">
              <AlertCircle 
                size={16} 
                color={isOverBudget ? "#ef4444" : "#10b981"} 
              />
              <Text className="text-xs text-slate-600 ml-1">
                Budget
              </Text>
            </View>
            <Text className={`text-sm font-semibold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
              {budgetUsed.toFixed(0)}% used
            </Text>
            <Text className="text-xs text-slate-500">
              {monthlyBudget.toFixed(0)} {currency} budget
            </Text>
          </View>
        )}

        {previousMonthExpenses > 0 && (
          <View className="flex-1 ml-2">
            <View className="flex-row items-center mb-1">
              <Calendar size={16} color="#64748b" />
              <Text className="text-xs text-slate-600 ml-1">
                vs Last Month
              </Text>
            </View>
            <Text className={`text-sm font-semibold ${percentageChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {percentageChange > 0 ? '+' : ''}{percentageChange.toFixed(1)}%
            </Text>
            <Text className="text-xs text-slate-500">
              {previousMonthExpenses.toFixed(0)} {currency} last month
            </Text>
          </View>
        )}
      </View>

      {monthlyBudget > 0 && (
        <View className="mt-4">
          <View className="bg-gray-200 rounded-full h-2">
            <View 
              className={`h-2 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min(budgetUsed, 100)}%` }}
            />
          </View>
        </View>
      )}
    </View>
  );
}