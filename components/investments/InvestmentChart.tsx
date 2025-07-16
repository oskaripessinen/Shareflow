import { View, Text } from 'react-native';

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

export default function InvestmentChart({}: InvestmentChartProps) {
  const typeLabels = {
    stock: 'Stocks',
    fund: 'Funds',
    crypto: 'Cryptocurrencies',
    etf: 'ETFs',
    bond: 'Bonds',
    other: 'Other',
  };

  const totalValue = TEST_DATA.reduce((sum, item) => sum + item.value, 0);
  console.log(TEST_DATA);

  const sortedData = [...TEST_DATA].sort((a, b) => b.value - a.value);

  return (
    <View className="my-2 bg-white rounded-xl p-5 border border-slate-300">
      <View className="mb-2">
        <Text className="text-lg font-semibold text-default">
          Distribution
        </Text>
      </View>

      <View className="h-12 justify-center items-center mb-4">
        <View className="flex-row h-6 w-full rounded overflow-hidden">
          {sortedData.map((item, index) => (
            <View
              key={index}
              className="h-6"
              style={{
                backgroundColor: item.color,
                width: `${Math.max(5, (item.value / totalValue) * 100)}%`,
              }}
            />
          ))}
        </View>
      </View>

      <View className="mt-2">
        {sortedData.map((item, index) => (
          <View key={index} className="flex-row items-center mb-2">
            <View
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: item.color }}
            />
            <Text className="flex-1 text-sm text-slate-900">
              {typeLabels[item.type as keyof typeof typeLabels] || 'Other'}
            </Text>
            <Text className="text-sm font-medium text-slate-900 mr-2 w-20 text-right">
              {item.value.toLocaleString()} €
            </Text>
            <Text className="text-sm text-slate-600 w-12 text-right">
              {((item.value / totalValue) * 100).toFixed(1)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
