import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface InvestmentSummaryProps {
  portfolioValue: number;
  investedValue: number;
  totalGain: number;
  percentGain: number;
}

export default function InvestmentSummary({
  portfolioValue,
  investedValue,
  totalGain,
  percentGain,
}: InvestmentSummaryProps) {
  const isProfitable = totalGain >= 0;

  return (
    <View className="bg-white rounded-xl p-4 border border-slate-300">
      <View className="items-center mb-4 pb-4 border-b border-slate-200">
        <Text className="text-base text-slate-500 mb-1">Portfolio value</Text>
        <Text className="text-3xl font-bold text-slate-900">{portfolioValue} €</Text>
      </View>

      <View className="flex-row justify-between">
        <View className="flex-1 items-center">
          <Text className="text-sm text-slate-500 mb-1">Invested</Text>
          <Text className="text-base font-semibold text-slate-900">{investedValue} €</Text>
        </View>

        <View className="flex-1 items-center">
          <Text className="text-sm text-slate-500 mb-1">Yield</Text>
          <View className="flex-row items-center">
            {isProfitable ? (
              <TrendingUp size={16} color="#10b981" className="mr-1" />
            ) : (
              <TrendingDown size={16} color="#ef4444" className="mr-1" />
            )}
            <Text className={`text-base font-semibold ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
              {isProfitable ? '+' : ''}
              {totalGain} €
            </Text>
          </View>
        </View>

        <View className="flex-1 items-center">
          <Text className="text-sm text-slate-500 mb-1">Yield-%</Text>
          <Text className={`text-base font-semibold ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
            {isProfitable ? '+' : ''}
            {percentGain}%
          </Text>
        </View>
      </View>
    </View>
  );
}
