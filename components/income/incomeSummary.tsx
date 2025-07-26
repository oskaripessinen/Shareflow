import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Calendar, Receipt } from 'lucide-react-native';

interface IncomeSummaryProps {
  totalIncome: number;
  previousMonthIncome?: number;
  percentChange: number;
  latestIncome?: {
    title: string;
    amount: number;
    created_at: string;
  };
  handleIncomePress: () => void;
  currency?: string;
}


const IncomeSummary = ({ 
  totalIncome,
  previousMonthIncome = 0,
  percentChange,
  latestIncome,
  handleIncomePress,
  currency = "€"
}: IncomeSummaryProps) => {

  return (
    <View className="bg-surface rounded-xl p-4 px-5 border border-slate-200">
      <View className="flex-row items-center mb-2 gap-2">
        <Receipt size={22} color='#3B82F6'/>
        <Text className="text-lg font-semibold text-default">
          Income Overview
        </Text>
      </View>

      <View className="flex-row justify-between items-start mb-1 mt-3">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-slate-900 mb-1">
            {totalIncome} {currency}
          </Text>
          {previousMonthIncome > 0 && (
            <View>
              <View className="flex-row items-center mb-1">
                <Calendar size={16} color="#64748b" />
                <Text className="text-xs text-slate-600 ml-1">
                  vs Last Month
                </Text>
              </View>
              <View className={`py-1 px-2.5 mt-1 rounded-2xl self-start ${percentChange > 0 ? 'bg-accent/20' : 'bg-danger/15'}`}>
                <Text className={`text-sm font-semibold ${percentChange > 0 ? 'text-accent' : 'text-danger'}`}>
                  {percentChange > 0 ? '+' : ''}{percentChange.toFixed(0)}%
                </Text>
              </View>
            </View>
          )}
        </View>

        {latestIncome && (
          <Pressable onPress={handleIncomePress} className="flex-1 ml-4 justify-center p-4 bg-slate-200/30 rounded-xl flex-column gap-2 active:bg-slate-200/60">
            <View className="flex-row items-center gap-1">
              <Receipt size={16} color="#64748b" />
              <Text className="text-xs text-slate-600 ml-1">
                Latest Income
              </Text>
              <Text className="text-xs text-slate-400 ml-1">
              {new Date(latestIncome.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long'
              })}
            </Text>
            </View>
            <View className='flex-row gap-2 align-center items-center'>
              <Text className="text-sm font-semibold text-default" numberOfLines={1}>
                {latestIncome.title} 
              </Text>
              <View className='py-1 px-2 mt-1 justify-center items-center bg-accent/20 rounded-xl'>
                <Text className="text-xs font-sans mt-0 text-accent">
                  {Number(latestIncome.amount).toFixed(0)} {currency}
                </Text>
              </View>
            </View>
            
          </Pressable>
        )}
      </View>

    
    </View>
  );
}

export default IncomeSummary;