import { useState } from 'react';
import { View, Text, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/../context/AppContext';
import InvestmentList from '@/../components/investments/InvestmentList';
import AddInvestmentForm from '@/../components/investments/AddInvestmentForm';
import InvestmentChart from '@/../components/investments/InvestmentChart';
import { Header } from '@/../components/investments/Header'

export default function InvestmentsScreen() {
  const { investments } = useAppStore();
  const [showAddInvestment, setShowAddInvestment] = useState(false);
  const [chartActive, setChartActive] = useState(false);

  const portfolioValue = investments.reduce((sum, inv) => sum + inv.quantity * inv.currentPrice, 0);
  const investedValue = investments.reduce((sum, inv) => sum + inv.quantity * inv.purchasePrice, 0);
  const totalGain = portfolioValue - investedValue;
  const percentGain = investedValue > 0 ? (totalGain / investedValue) * 100 : 0;

  const investmentsByType = investments.reduce(
    (groups, inv) => {
      const value = inv.quantity * inv.currentPrice;
      groups[inv.type] = (groups[inv.type] || 0) + value;
      return groups;
    },
    {} as Record<string, number>,
  );

  const chartData = Object.keys(investmentsByType).map((type) => ({
    type,
    value: investmentsByType[type],
    color: getColorForType(type),
  }));

  function getColorForType(type: string) {
    switch (type) {
      case 'stock':
        return '#0891b2';
      case 'fund':
        return '#0ea5e9';
      case 'crypto':
        return '#06b6d4';
      case 'etf':
        return '#0284c7';
      case 'bond':
        return '#38bdf8';
      default:
        return '#7dd3fc';
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['left', 'right']}>
      <ScrollView 
        className="flex-1 mt-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 0,
          paddingBottom: 20,
        }}
      >
      <View className='gap-3'>
        <Header chartActive={chartActive} setChartActive={setChartActive} />

        <InvestmentChart data={chartData} />
        
        <Text className="text-lg font-semibold text-slate-900 mt-4 mb-2">Investments</Text>
        
        <View className="space-y-2">
          {investments.map((item) => (
            <InvestmentList key={item.id.toString()} investments={[item]} />
          ))}
        </View>
      </View>
      </ScrollView>

      <Modal
        visible={showAddInvestment}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddInvestment(false)}
      >
        <AddInvestmentForm onClose={() => setShowAddInvestment(false)} />
      </Modal>
    </SafeAreaView>
  );
}
