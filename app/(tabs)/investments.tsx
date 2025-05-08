import { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { useAppContext } from '@/../context/AppContext';
import InvestmentList from '@/../components/investments/InvestmentList';
import AddInvestmentForm from '@/../components/investments/AddInvestmentForm';
import InvestmentSummary from '@/../components/investments/InvestmentSummary';
import InvestmentChart from '@/../components/investments/InvestmentChart';

export default function InvestmentsScreen() {
  const { investments } = useAppContext();
  const [showAddInvestment, setShowAddInvestment] = useState(false);

  const portfolioValue = investments.reduce((sum, inv) => sum + inv.quantity * inv.currentPrice, 0);
  const investedValue = investments.reduce((sum, inv) => sum + inv.quantity * inv.purchasePrice, 0);
  const totalGain = portfolioValue - investedValue;
  const percentGain = investedValue > 0 ? (totalGain / investedValue) * 100 : 0;

  const investmentsByType = investments.reduce((groups, inv) => {
    const value = inv.quantity * inv.currentPrice;
    groups[inv.type] = (groups[inv.type] || 0) + value;
    return groups;
  }, {} as Record<string, number>);

  const chartData = Object.keys(investmentsByType).map(type => ({
    type,
    value: investmentsByType[type],
    color: getColorForType(type),
  }));

  function getColorForType(type: string) {
    switch (type) {
      case 'stock': return '#0891b2';
      case 'fund': return '#0ea5e9';
      case 'crypto': return '#06b6d4';
      case 'etf': return '#0284c7';
      case 'bond': return '#38bdf8';
      default: return '#7dd3fc';
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <FlatList
      showsVerticalScrollIndicator={false}
        data={investments}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, }}
        ListHeaderComponent={() => (
          <>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-2xl font-bold text-slate-900">Portfolio</Text>
              <Pressable
                className="flex-row items-center bg-cyan-600 px-3 py-2 rounded-md"
                onPress={() => setShowAddInvestment(true)}
              >
                <Plus size={20} color="#fff" />
                <Text className="text-white font-medium ml-2">Add Investment</Text>
              </Pressable>
            </View>

            <InvestmentSummary
              portfolioValue={portfolioValue}
              investedValue={investedValue}
              totalGain={totalGain}
              percentGain={percentGain}
            />

            <View className="bg-white rounded-xl p-4 mt-4 shadow">
              <Text className="text-lg font-semibold text-slate-900 mb-4">
                Portfolio distribution
              </Text>
              <InvestmentChart data={chartData} />
            </View>

            <Text className="text-lg font-semibold text-slate-900 mt-4 mb-2">
              Investments
            </Text>
          </>
        )}
        renderItem={({ item }) => (
          <InvestmentList investments={[item]} />
        )}
      />

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