import { View, Text, StyleSheet } from 'react-native';

interface ChartData {
  type: string;
  value: number;
  color: string;
}

interface InvestmentChartProps {
  data: ChartData[];
}

export default function InvestmentChart({ data }: InvestmentChartProps) {
  // Get type labels
  const typeLabels = {
    stock: 'Stocks',
    fund: 'Funds',
    crypto: 'Cryptocurrencies',
    etf: 'ETFs',
    bond: 'Bonds',
    other: 'Other',
  };

  // Calculate total value
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  // Sort data by value for better visualization
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  return (
    <View style={styles.container}>
      {totalValue > 0 ? (
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
                  {typeLabels[item.type as keyof typeof typeLabels] || 'Muut'}
                </Text>
                <Text style={styles.legendAmount}>{item.value.toFixed(0)} €</Text>
                <Text style={styles.legendPercentage}>
                  {((item.value / totalValue) * 100).toFixed(1)}%
                </Text>
              </View>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.emptyChart}>
          <Text style={styles.emptyText}>No investments</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
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
    backgroundColor: '#e2e8f0', // Slate-200
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b', // Slate-500
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
    color: '#0f172a', // Slate-900
  },
  legendAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a', // Slate-900
    marginRight: 8,
    width: 80,
    textAlign: 'right',
  },
  legendPercentage: {
    fontSize: 14,
    color: '#64748b', // Slate-500
    width: 50,
    textAlign: 'right',
  },
});
