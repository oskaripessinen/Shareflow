import { View, Text, StyleSheet } from 'react-native';

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Investment Portfolio</Text>
        <Text style={styles.totalValue}>Total: {totalValue.toLocaleString()} €</Text>
      </View>

      <>
        <View style={styles.chartContainer}>
          <View style={styles.barChart}>
            {sortedData.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.barSegment,
                  {
                    backgroundColor: item.color,
                    width: `${Math.max(5, (item.value / totalValue) * 100)}%`,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.legend}>
          {sortedData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>
                {typeLabels[item.type as keyof typeof typeLabels] || 'Other'}
              </Text>
              <Text style={styles.legendAmount}>{item.value.toLocaleString()} €</Text>
              <Text style={styles.legendPercentage}>
                {((item.value / totalValue) * 100).toFixed(1)}%
              </Text>
            </View>
          ))}
        </View>
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  chartContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  barChart: {
    flexDirection: 'row',
    height: 24,
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barSegment: {
    height: 24,
  },
  emptyChart: {
    height: 24,
    width: '100%',
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
  },
  legend: {
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  legendAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
    marginRight: 8,
    width: 80,
    textAlign: 'right',
  },
  legendPercentage: {
    fontSize: 14,
    color: '#64748b',
    width: 50,
    textAlign: 'right',
  },
});
