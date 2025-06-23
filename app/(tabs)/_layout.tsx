import { Tabs } from 'expo-router';
import { Home, CreditCard, TrendingUp, HandCoins } from 'lucide-react-native';
import { View } from 'react-native';
import GroupHeader from '@/../components/common/GroupHeader';

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <GroupHeader />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#3B82F6',
          tabBarInactiveTintColor: '#6B7280',
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#e2e8f0',
            paddingTop: 8,
            paddingBottom: 5,
            height: 55,
          },
          tabBarLabelStyle: {
            fontSize: 0,
            fontWeight: '500',
            fontFamily: 'Poppins_600SemiBold',
          },
          headerStyle: {
            backgroundColor: '#F8FAFC',
          },
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
            color: '#0f172a',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: '',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="income"
          options={{
            title: '',
            tabBarIcon: ({ color, size }) => <HandCoins size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="expenses"
          options={{
            title: '',
            tabBarIcon: ({ color, size }) => <CreditCard size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="investments"
          options={{
            title: '',
            tabBarIcon: ({ color, size }) => <TrendingUp size={size} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}
