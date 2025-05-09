import { View, Text, StyleSheet } from 'react-native';
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
  percentGain 
}: InvestmentSummaryProps) {
  const isProfitable = totalGain >= 0;

  return (
    <View style={styles.container}>
      <View style={styles.mainValue}>
        <Text style={styles.labelMain}>Portfolio value</Text>
        <Text style={styles.valueMain}>{portfolioValue.toFixed(2)} €</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Invested</Text>
          <Text style={styles.detailValue}>{investedValue.toFixed(2)} €</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Yield</Text>
          <View style={styles.gainContainer}>
            {isProfitable ? (
              <TrendingUp size={16} color="#10b981" style={styles.gainIcon} />
            ) : (
              <TrendingDown size={16} color="#ef4444" style={styles.gainIcon} />
            )}
            <Text style={[
              styles.gainValue, 
              { color: isProfitable ? '#10b981' : '#ef4444' }
            ]}>
              {isProfitable ? '+' : ''}{totalGain.toFixed(2)} €
            </Text>
          </View>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Yield-%</Text>
          <Text style={[
            styles.gainValue, 
            { color: isProfitable ? '#10b981' : '#ef4444' }
          ]}>
            {isProfitable ? '+' : ''}{percentGain.toFixed(2)}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  mainValue: {
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0', // Slate-200
  },
  labelMain: {
    fontSize: 16,
    color: '#64748b', // Slate-500
    marginBottom: 4,
  },
  valueMain: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0f172a', // Slate-900
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b', // Slate-500
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a', // Slate-900
  },
  gainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gainIcon: {
    marginRight: 4,
  },
  gainValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});