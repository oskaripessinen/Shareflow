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
      <View className="flex-row items-center gap-2">
        <CreditCard size={22} color='#3B82F6'/>
        <Text className="text-lg font-semibold text-default">
          Expenses Overview
        </Text>
      </View>

      <View className="flex-row justify-between items-start mb-1 mt-3">
        <View className="flex-1">
          <View className=''>
            <Text className="text-2xl font-bold text-slate-900 mb-1">
              {totalExpenses} {currency}
            </Text>
              <View className='flex-row justify-center items-center gap-2'>
              {previousMonthExpenses > 0 && (
                <View className='flex-column'>
                  <View className="flex-row items-center mb-1">
                    <Calendar size={16} color="#64748b" />
                    <Text className="text-xs text-slate-600 ml-1">
                      vs prev Month
                    </Text>
                  </View>
                  <View className={`py-1 px-2.5 mt-1 rounded-2xl self-start ${percentChange > 0 ? 'bg-danger/15' : 'bg-accent/20'}`}>
                    <Text className={`text-sm font-semibold ${percentChange > 0 ? 'text-danger' : 'text-accent'}`}>
                      {percentChange > 0 ? '+' : ''}{percentChange.toFixed(0)}%
                    </Text>
                  </View>
                </View>
              )}
              {latestExpense && (
                <Pressable onPress={handleExpensePress} className="flex-1 justify-center items-center p-3 px-8 bg-slate-200/30 rounded-xl flex-column gap-2 active:bg-slate-200/60">
                  <View className="flex-row items-center gap-1">
                    <Text numberOfLines={1} className="text-xs text-slate-600 ml-1">
                      Latest
                    </Text>
                    <Text className="text-xs text-slate-400 ml-1">
                    {new Date(latestExpense.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </Text>
                  </View>
                  <View className='flex-row gap-2 align-center items-center'>
                    <Text className="text-xs font-semibold text-default" numberOfLines={1}>
                      {latestExpense.title} 
                    </Text>
                    <View className='py-1 px-2 mt-1 justify-center items-center bg-accent/20 rounded-xl'>
                      <Text className="text-xs font-sans mt-0 text-accent">
                        {Number(latestExpense.amount).toFixed(0)} {currency}
                      </Text>
                    </View>
                  </View>
                  
                </Pressable>
              )}
            </View>
            
          </View>
        </View>

        
      </View>

    
    </View>
  );
}

export default ExpenseSummary;