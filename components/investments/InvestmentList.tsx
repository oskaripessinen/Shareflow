import { View, Text } from 'react-native';
import { Investment } from '../../api/investments';
import { formatDate } from '@/../utils/dateUtils';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import { getSavingCategoryColor } from 'utils/categoryColors';

interface InvestmentListProps {
  investments: Investment[];
}

export default function InvestmentList({ investments }: InvestmentListProps) {

  const renderInvestmentItem = (item: Investment) => {
    const currentPrice = item.purchase_price * 1.1;
    const currentValue = item.quantity * currentPrice;
    const purchaseValue = item.quantity * item.purchase_price;
    const profit = currentValue - purchaseValue;
    const profitPercent = ((profit / purchaseValue) * 100).toFixed(2);
    const isProfitable = profit >= 0;

    return (
      <View key={item.id} className="mb-3 bg-surface rounded-xl p-4 border border-slate-200">
        <View className="flex-row items-center">
          <View 
            className="w-3 h-3 rounded-full mr-3"
            style={{ backgroundColor: getSavingCategoryColor(item.type) }}
          />
          <View className="flex-1">
            <View className='flex-row items-center gap-2'>
              <Text className="text-base font-semibold text-slate-900">
                {item.name}
              </Text>
              <Text className="text-sm text-slate-500 mr-2">
                {item.type}
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
                  <TrendingUp size={14} color="#10b981" />
                ) : (
                  <TrendingDown size={14} color="#ef4444" />
                )}
                <Text 
                  className="text-sm font-sans"
                  style={{ color: isProfitable ? '#10b981' : '#ef4444' }}
                >
                  {isProfitable ? '+' : ''}
                  {profit.toFixed(2)} €
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
        <View>
          {investments.map(renderInvestmentItem)}
        </View>
      ) : (
        <View className="p-6 items-center justify-center">
          <Text className="text-base text-slate-500">No investments</Text>
        </View>
      )}
    </View>
  );
}
