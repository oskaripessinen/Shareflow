import { useState, useRef } from 'react';
import { View, Pressable, Text } from 'react-native';
import PagerView, { PagerViewOnPageSelectedEvent } from 'react-native-pager-view';
import { Home, CreditCard, TrendingUp, Receipt } from 'lucide-react-native';
import GroupHeader from '@/../components/common/GroupHeader';

import DashboardScreen from './index';
import IncomeScreen from './income';
import ExpensesScreen from './expenses';
import InvestmentsScreen from './investments';

const tabs = [
  { name: 'Home', icon: Home, component: DashboardScreen, key: 'home' },
  { name: 'Income', icon: Receipt, component: IncomeScreen, key: 'income' },
  { name: 'Expenses', icon: CreditCard, component: ExpensesScreen, key: 'expenses' },
  { name: 'Savings', icon: TrendingUp, component: InvestmentsScreen, key: 'investments' },
];

export default function TabLayout() {
  const [activeTab, setActiveTab] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    pagerRef.current?.setPage(index);
  };

  // Funktio navigoimaan tabiin nimen perusteella
  const navigateToTab = (tabKey: string) => {
    const tabIndex = tabs.findIndex(tab => tab.key === tabKey);
    if (tabIndex !== -1) {
      handleTabPress(tabIndex);
    }
  };

  const handlePageSelected = (event: PagerViewOnPageSelectedEvent) => {
    setActiveTab(event.nativeEvent.position);
  };

  return (
    <View style={{ flex: 1 }}>
      <GroupHeader />
      
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={handlePageSelected}
        scrollEnabled={true}
      >
        {tabs.map((tab, index) => {
          const Component = tab.component;
          return (
            <View key={index} style={{ flex: 1 }}>
              <Component navigateToTab={navigateToTab} />
            </View>
          );
        })}
      </PagerView>

      <View className="bg-white border-t border-slate-200 px-2 py-2">
        <View className="flex-row justify-around">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === index;
            
            return (
              <Pressable
                key={index}
                onPress={() => handleTabPress(index)}
                className="flex-1 items-center justify-center py-2 mx-2 rounded-lg"
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                  backgroundColor: pressed ? '#e0e7ff' : 'transparent',
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                })}
              >
                <Icon
                  size={24}
                  color={isActive ? '#3b82f6' : '#64748b'}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                <Text 
                  className={`text-xs font-medium mt-1 ${
                    isActive ? 'text-blue-600' : 'text-slate-600'
                  }`}
                  style={{ fontFamily: 'Poppins_600SemiBold' }}
                >
                  {tab.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}