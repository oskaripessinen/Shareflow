import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGroupStore } from '@/../context/AppContext';
import InvestmentList from '@/../components/investments/InvestmentList';
import InvestmentDistribution from 'components/investments/InvestmentDistribution';
import InvestmentChart from 'components/investments/InvestmentChart';
import AddInvestmentModal from '@/../components/investments/AddInvestmentModal'
import { Header } from '@/../components/investments/Header'
import { investmentsApi, Investment } from '../../api/investments'

export default function InvestmentsScreen() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentGroup } = useGroupStore();
  const [showAddInvestmentModal, setShowAddInvestmentModal] = useState(false);
  const [chartActive, setChartActive] = useState(false);

  const fetchInvestments = async () => {
    if (!currentGroup) {
      console.log('No current group selected');
      return;
    }

    setLoading(true);
    try {
      const investmentData = await investmentsApi.GetInvestmentsByGroupId(currentGroup.id);
      setInvestments(investmentData || []);
      console.log('Investments fetched:', investmentData);
    } catch (error) {
      console.error('Error fetching investments:', error);
      setInvestments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, [currentGroup?.id]);

  const refreshInvestments = () => {
    fetchInvestments();
  };

  const investmentsByType = investments.reduce(
    (groups, inv) => {
      const value = inv.quantity * inv.purchase_price;
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
      <View className="flex-1 px-4 pt-5">
        <View className='gap-3 mb-4'>
          <Header 
            chartActive={chartActive} 
            setShowAddInvestmentModal={setShowAddInvestmentModal} 
            setChartActive={setChartActive} 
          />
          {!chartActive ? <InvestmentDistribution data={chartData} /> : <InvestmentChart />}
        </View>
        
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-gray-500 mt-2">Loading investments...</Text>
          </View>
        ) : (
          <InvestmentList investments={investments} />
        )}
      </View>

      <Modal
        isVisible={showAddInvestmentModal}
        animationIn="fadeIn"
        animationOut="fadeOut"
        onBackdropPress={() => setShowAddInvestmentModal(false)}
        style={{ justifyContent: 'flex-end', margin: 0 }}
        statusBarTranslucent={true}
        backdropOpacity={0.5}
      >
        <AddInvestmentModal 
          onClose={() => setShowAddInvestmentModal(false)}
          onInvestmentAdded={refreshInvestments}
        />
      </Modal>
    </SafeAreaView>
  );
}
