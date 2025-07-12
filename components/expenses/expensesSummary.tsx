import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Calendar, CreditCard } from 'lucide-react-native';

interface ExpenseSummaryProps {
  totalExpenses: number;
  previousMonthExpenses?: number;
  percentChange: number;
  latestExpense?: {
    title: string;
    amount: number;
    created_at: string;
  };
  handleExpensePress: () => void;
  currency?: string;
}


const ExpenseSummary = ({ 
  totalExpenses,
  previousMonthExpenses = 0,
  percentChange,
  latestExpense,
  handleExpensePress,
  currency = "€"
}: ExpenseSummaryProps) => {

  return (
    <View className="bg-surface rounded-xl py-4 px-5 border border-slate-200">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-lg font-semibold text-default">
          Expenses Overview
        </Text>
        
      </View>

      <View className="flex-row justify-between items-start mb-1 mt-3">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-slate-900 mb-1">
            {totalExpenses} {currency}
          </Text>
          {previousMonthExpenses > 0 && (
            <View>
              <View className="flex-row items-center mb-1">
                <Calendar size={16} color="#64748b" />
                <Text className="text-xs text-slate-600 ml-1">
                  vs Last Month
                </Text>
              </View>
              <Text className={`text-sm font-semibold ${percentChange > 0 ? 'text-danger' : 'text-accent'}`}>
                {percentChange > 0 ? '+' : ''}{percentChange.toFixed(0)}%
              </Text>
            </View>
          )}
        </View>

        {latestExpense && (
          <Pressable onPress={handleExpensePress} className="flex-1 ml-4 justify-center p-4 bg-slate-200/30 rounded-xl flex-column gap-2 active:bg-slate-200/60">
            <View className="flex-row items-center gap-1">
              <CreditCard size={16} color="#64748b" />
              <Text className="text-xs text-slate-600 ml-1">
                Latest Expense
              </Text>
              <Text className="text-xs text-slate-400 ml-1">
              {new Date(latestExpense.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long'
              })}
            </Text>
            </View>
            <View className='flex-row gap-2 align-center items-center'>
              <Text className="text-sm font-semibold text-default" numberOfLines={1}>
                {latestExpense.title} 
              </Text>
              <View className='py-1 px-2 mt-1 justify-center items-center bg-danger/15 rounded-xl'>
                <Text className="text-xs font-sans mt-0 text-danger">
                  {Number(latestExpense.amount).toFixed(0)} {currency}
                </Text>
              </View>
            </View>
            
          </Pressable>
        )}
      </View>

    
    </View>
  );
}

export default ExpenseSummary;