import { Tabs } from 'expo-router';
import { Home, CreditCard, TrendingUp } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0891b2', // Cyan-600
        tabBarInactiveTintColor: '#64748b', // Slate-500
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0', // Slate-200
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
          color: '#0f172a', // Slate-900
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Overview',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: 'ShareFlow',
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color, size }) => <CreditCard size={size} color={color} />,
          headerTitle: 'ShareFlow',
        }}
      />
      <Tabs.Screen
        name="investments"
        options={{
          title: 'Savings',
          tabBarIcon: ({ color, size }) => <TrendingUp size={size} color={color} />,
          headerTitle: 'ShareFlow',
        }}
      />
    </Tabs>
  );
}
