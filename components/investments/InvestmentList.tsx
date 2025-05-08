
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Investment } from '@/../context/AppContext';
import { formatDate } from '@/../utils/dateUtils';
import { TrendingUp, TrendingDown, Edit, Trash } from 'lucide-react-native';
import { useAppContext } from '@/../context/AppContext';

interface InvestmentListProps {
  investments: Investment[];
}

export default function InvestmentList({ investments }: InvestmentListProps) {
  const { deleteInvestment } = useAppContext();

  // Type information with colors and labels
  const typeInfo = {
    stock: { color: '#0891b2', label: 'Osake' },  // Cyan-600
    fund: { color: '#0ea5e9', label: 'Rahasto' }, // Sky-500
    crypto: { color: '#06b6d4', label: 'Kryptovaluutta' }, // Cyan-500
    etf: { color: '#0284c7', label: 'ETF' }, // Sky-600
    bond: { color: '#38bdf8', label: 'Joukkovelkakirja' }, // Sky-400
    other: { color: '#7dd3fc', label: 'Muu' }, // Sky-300
  };

  const handleEdit = (investment: Investment) => {
    // Implement edit functionality
    console.log('Edit investment:', investment);
  };

  const handleDelete = (id: string) => {
    deleteInvestment(id);
  };

  const renderInvestmentItem = ({ item }: { item: Investment }) => {
    const typeColor = typeInfo[item.type as keyof typeof typeInfo]?.color || '#7dd3fc';
    const typeLabel = typeInfo[item.type as keyof typeof typeInfo]?.label || 'Muu';
    
    const currentValue = item.quantity * item.currentPrice;
    const purchaseValue = item.quantity * item.purchasePrice;
    const profit = currentValue - purchaseValue;
    const profitPercent = ((profit / purchaseValue) * 100).toFixed(2);
    const isProfitable = profit >= 0;
    
    return (
      <View style={styles.investmentItem}>
        <View style={styles.investmentMain}>
          <View style={[styles.typeIndicator, { backgroundColor: typeColor }]} />
          <View style={styles.investmentDetails}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.investmentMeta}>
              <Text style={styles.type}>{typeLabel}</Text>
              <Text style={styles.quantity}>{item.quantity} kpl</Text>
              <Text style={styles.date}>{formatDate(item.purchaseDate)}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.valueSection}>
          <Text style={styles.currentValue}>{currentValue.toFixed(2)} €</Text>
          <View style={styles.profitSection}>
            {isProfitable ? (
              <TrendingUp size={14} color="#10b981" style={styles.profitIcon} />
            ) : (
              <TrendingDown size={14} color="#ef4444" style={styles.profitIcon} />
            )}
            <Text style={[
              styles.profitText, 
              {color: isProfitable ? '#10b981' : '#ef4444'}
            ]}>
              {isProfitable ? '+' : ''}{profit.toFixed(2)} € ({profitPercent}%)
            </Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <Pressable style={styles.editButton} onPress={() => handleEdit(item)}>
            <Edit size={16} color="#0891b2" />
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
            <Trash size={16} color="#ef4444" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {investments.length > 0 ? (
        <FlatList
          data={investments}
          renderItem={renderInvestmentItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Ei sijoituksia</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  investmentItem: {
    marginBottom: 12,
    backgroundColor: '#f8fafc', // Slate-50
    borderRadius: 8,
    padding: 12,
  },
  investmentMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  investmentDetails: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a', // Slate-900
    marginBottom: 4,
  },
  investmentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  type: {
    fontSize: 14,
    color: '#64748b', // Slate-500
    marginRight: 8,
  },
  quantity: {
    fontSize: 14,
    color: '#64748b', // Slate-500
    marginRight: 8,
  },
  date: {
    fontSize: 14,
    color: '#94a3b8', // Slate-400
  },
  valueSection: {
    marginBottom: 8,
  },
  currentValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a', // Slate-900
    marginBottom: 2,
  },
  profitSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profitIcon: {
    marginRight: 4,
  },
  profitText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    padding: 6,
    backgroundColor: '#e0f2fe', // Cyan-100
    borderRadius: 4,
    marginRight: 8,
  },
  deleteButton: {
    padding: 6,
    backgroundColor: '#fee2e2', // Red-100
    borderRadius: 4,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b', // Slate-500
  },
});