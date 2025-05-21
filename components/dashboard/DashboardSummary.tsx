import { View, Text } from 'react-native';

interface DashboardSummaryProps {
  income: number;
  expenses: number;
  savings: number;
  remaining: number;
}

export default function DashboardSummary({
  income,
  expenses,
  savings,
  remaining,
}: DashboardSummaryProps) {
  return (
    <View className="my-2">
      <View className="flex-row mb-2 gap-x-2">
        <View className="flex-1 bg-white rounded-xl p-4 shadow">
          <Text className="text-sm font-medium text-slate-500 mb-1">Income</Text>
          <Text className="text-xl font-bold text-slate-900">{income.toFixed(2)} €</Text>
        </View>
        <View className="flex-1 bg-white rounded-xl p-4 shadow">
          <Text className="text-sm font-medium text-slate-500 mb-1">Expenses</Text>
          <Text className="text-xl font-bold text-red-500">{expenses.toFixed(2)} €</Text>
        </View>
      </View>

      <View className="flex-row gap-x-2">
        <View className="flex-1 bg-white rounded-xl p-4 shadow">
          <Text className="text-sm font-medium text-slate-500 mb-1">Goal</Text>
          <Text className="text-xl font-bold text-emerald-500">{savings.toFixed(2)} €</Text>
        </View>
        <View className="flex-1 bg-white rounded-xl p-4 shadow">
          <Text className="text-sm font-medium text-slate-500 mb-1">Remaining</Text>
          <Text
            className={`text-xl font-bold ${remaining >= 0 ? 'text-emerald-500' : 'text-red-500'}`}
          >
            {remaining.toFixed(2)} €
          </Text>
        </View>
      </View>
    </View>
  );
}
