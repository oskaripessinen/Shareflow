import { View, Text } from 'react-native';
import { PieChart } from 'lucide-react-native';

interface ChartData {
  type: string;
  value: number;
  color: string;
}

interface InvestmentChartProps {
  data?: ChartData[];
}

const TEST_DATA: ChartData[] = [
  {
    type: 'stock',
    value: 15000,
    color: '#3B82F6',
  },
  {
    type: 'etf',
    value: 8500,
    color: '#10B981',
  },
  {
    type: 'crypto',
    value: 5200,
    color: '#F59E0B',
  },
  {
    type: 'fund',
    value: 12000,
    color: '#8B5CF6',
  },
  {
    type: 'bond',
    value: 3000,
    color: '#EF4444',
  },
  {
    type: 'other',
    value: 1800,
    color: '#6B7280',
  },
];

export default function InvestmentDistribution({}: InvestmentChartProps) {
  const typeLabels = {
    stock: 'Stocks',
    fund: 'Funds',
    crypto: 'Cryptocurrencies',
    etf: 'ETFs',
    bond: 'Bonds',
    other: 'Other',
  };

  const totalValue = TEST_DATA.reduce((sum, item) => sum + item.value, 0);

  const sortedData = [...TEST_DATA].sort((a, b) => b.value - a.value);

  return (
    <View className="bg-surface px-4 py-3 mb-5 border border-slate-200 rounded-xl">
      <View className="mb-4 gap-2 flex-row items-center">
      <PieChart size={18} color="#3B82F6" strokeWidth={2.2}/>
        <Text className="text-lg font-semibold text-default">
          Distribution
        </Text>
      </View>

        <View className="flex-row h-7 bg-white mb-2 gap-1 bg-gray-200 justify-center mx-2.5">
          {sortedData.map((item, index) => (
            <View
              key={index}
              className="h-full rounded-lg"
              style={{
                backgroundColor: item.color,
                width: `${Math.max(5, (item.value / totalValue) * 100)}%`,
              }}
            />
          ))}
        </View>

      <View className="mt-4">
        {sortedData.map((item, index) => (
          <View key={index} className="flex-row items-center mb-2">
            <View
              className="w-4 h-4 rounded mr-2"
              style={{ backgroundColor: item.color }}
            />
            <Text className="flex-1 text-default capitalize font-semibold text-base">
              {typeLabels[item.type as keyof typeof typeLabels] || 'Other'}
            </Text>
            <Text className="text-default font-semibold text-sm">
              {item.value.toLocaleString()} €
            </Text>
            <Text className="text-muted text-sm font-sans text-sm ml-2 w-12 text-right">
              {((item.value / totalValue) * 100).toFixed(1)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
