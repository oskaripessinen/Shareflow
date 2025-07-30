import { View, Text, FlatList } from 'react-native';
import { Investment } from '../../api/investments';
import { formatDate } from '@/../utils/dateUtils';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { useAppStore } from '@/../context/AppContext';

interface InvestmentListProps {
  investments: Investment[];
}

export default function InvestmentList({ investments }: InvestmentListProps) {
  const { deleteInvestment } = useAppStore();

  const typeInfo = {
    stock: { color: '#0891b2', label: 'Stock' },
    fund: { color: '#0ea5e9', label: 'Fund' },
    crypto: { color: '#06b6d4', label: 'Cryptocurrency' },
    etf: { color: '#0284c7', label: 'ETF' },
    bond: { color: '#38bdf8', label: 'Bond' },
    other: { color: '#7dd3fc', label: 'Other' },
  };

  const handleEdit = (investment: Investment) => {
    console.log('Edit investment:', investment);
  };

  const handleDelete = (id: number) => {
    deleteInvestment(id);
  };

  const renderInvestmentItem = ({ item }: { item: Investment }) => {
    const typeColor = typeInfo[item.type as keyof typeof typeInfo]?.color || '#7dd3fc';
    const typeLabel = typeInfo[item.type as keyof typeof typeInfo]?.label || 'Other';

    const currentPrice = item.purchase_price * 1.1;
    const currentValue = item.quantity * currentPrice;
    const purchaseValue = item.quantity * item.purchase_price;
    const profit = currentValue - purchaseValue;
    const profitPercent = ((profit / purchaseValue) * 100).toFixed(2);
    const isProfitable = profit >= 0;

    return (
      <View className="mb-3 bg-surface rounded-xl p-4 border border-slate-200 justify-between">
        <View className="flex-row items-center justify-center">
          <View 
            className="w-3 h-3 rounded-full mr-3"
            style={{ backgroundColor: typeColor }}
          />
          <View className="flex-1">
            <View className='flex-row items-center gap-2'>
              <Text className="text-base font-semibold text-slate-900">
                {item.name}
              </Text>
              <Text className="text-sm text-slate-500 mr-2">
                  {typeLabel}
              </Text>
            </View>
            <View className="flex-row items-center">
              
              <Text className="text-sm text-muted mr-2">{item.quantity} kpl</Text>
              <Text className="text-sm text-slate-400">
                {formatDate(new Date(item.purchase_date))}
              </Text>
            </View>
          </View>
          <View className="gap-1 justify-center">
            <Text className="text-base font-semibold self-center text-default mb-0.5">
              {currentValue.toFixed(2)} €
            </Text>
            <View className="flex-row items-center gap-2 justify-between">
              <View className='flex-row items-center gap-2'>
                {isProfitable ? (
                  <TrendingUp size={14} color="#10b981" className="mr-1" />
                ) : (
                  <TrendingDown size={14} color="#ef4444" className="mr-1" />
                )}
                <Text 
                  className="text-sm font-sans"
                  style={{ color: isProfitable ? '#10b981' : '#ef4444' }}
                >
                  {isProfitable ? '+' : ''}
                  {profit.toFixed(2)} € ({profitPercent}%)
                </Text>
              </View>
            </View>
          </View>
        </View>

        

        
      </View>
    );
  };

  return (
    <View className="flex-1">
      {investments.length > 0 ? (
        <FlatList
          data={investments}
          renderItem={renderInvestmentItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="p-6 items-center justify-center">
          <Text className="text-base text-slate-500">No investments</Text>
        </View>
      )}
    </View>
  );
}
