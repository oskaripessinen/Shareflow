import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Modal from 'react-native-modal'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/../context/AppContext';
import InvestmentList from '@/../components/investments/InvestmentList';
import InvestmentDistribution from 'components/investments/InvestmentDistribution';
import InvestmentChart from 'components/investments/InvestmentChart';
import AddInvestmentModal from '@/../components/investments/AddInvestmentModal'
import { Header } from '@/../components/investments/Header'

export default function InvestmentsScreen() {
  const { investments } = useAppStore();
  const [showAddInvestmentModal, setShowAddInvestmentModal] = useState(false);
  const [chartActive, setChartActive] = useState(false);


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
        <Header chartActive={chartActive} setShowAddInvestmentModal={setShowAddInvestmentModal} setChartActive={setChartActive} />
        {!chartActive ? <InvestmentDistribution data={chartData} /> : <InvestmentChart />}
        
        
        <Text className="text-lg font-semibold text-slate-900 mt-4 mb-2">Investments</Text>
        
        <View className="space-y-2">
          {investments.map((item) => (
            <InvestmentList key={item.id.toString()} investments={[item]} />
          ))}
        </View>
      </View>
      </ScrollView>

      <Modal
        isVisible={showAddInvestmentModal}
        onSwipeComplete={() => setShowAddInvestmentModal(false)}
        swipeDirection="down"
        animationIn="fadeIn"
        animationOut="fadeOut"
        onBackdropPress={() => setShowAddInvestmentModal(false)}
        style={{ justifyContent: 'flex-end', margin: 0 }}
        statusBarTranslucent={true}
        backdropOpacity={0.5}
      >
        <AddInvestmentModal onClose={() => setShowAddInvestmentModal(false)}/>
      </Modal>
    </SafeAreaView>
  );
}
