import { Tabs } from 'expo-router';
import { Home, CreditCard, TrendingUp, Receipt } from 'lucide-react-native';
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
            height: 65,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '500',
            fontFamily: 'Poppins_600SemiBold',
          },
          headerStyle: {
            backgroundColor: '#F8FAFC',
          },
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 10,
            color: '#0f172a',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size, focused }) => <Home strokeWidth={focused ? 2 : 1.5} size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="income"
          options={{
            title: 'Income',
            tabBarIcon: ({ color, size, focused }) => <Receipt strokeWidth={focused ? 2 : 1.5} size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="expenses"
          options={{
            title: 'Expenses',
            tabBarIcon: ({ color, size, focused }) => <CreditCard strokeWidth={focused ? 2 : 1.5} size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="investments"
          options={{
            title: 'Savings',
            tabBarIcon: ({ color, size, focused }) => <TrendingUp strokeWidth={focused ? 2 : 1.5} size={size} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}
