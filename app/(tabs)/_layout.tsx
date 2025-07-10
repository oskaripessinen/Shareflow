import { Tabs } from 'expo-router';
import { Home, CreditCard, TrendingUp, Receipt } from 'lucide-react-native';
import { View, Pressable } from 'react-native';
import GroupHeader from '@/../components/common/GroupHeader';

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <GroupHeader />
      <Tabs
        screenOptions={{
          headerShown: false,

          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#e2e8f0',
            paddingTop: 8,
            paddingBottom: 5,
            height: 65,
          },
          tabBarItemStyle: {
            borderRadius: 8,
            marginHorizontal: 8,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '500',
            fontFamily: 'Poppins_600SemiBold',
          },
          tabBarButton: (props) => {
            const { 
              children, 
              onPress, 
              onLongPress, 
              style, 
              accessibilityLabel,
              accessibilityRole,
              accessibilityState,
              testID,
            } = props;
            
            return (
              <Pressable 
                
                onPress={onPress}
                onLongPress={onLongPress}
                style={style}
                accessibilityLabel={accessibilityLabel}
                accessibilityRole={accessibilityRole}
                accessibilityState={accessibilityState}
                testID={testID}
                className='bg-slate-700 active:bg-slate-800'
              >
                {children}
              </Pressable>
            );
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size, focused }) => (
              <Home strokeWidth={focused ? 2 : 1.5} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="income"
          options={{
            title: 'Income',
            tabBarIcon: ({ color, size, focused }) => (
              <Receipt strokeWidth={focused ? 2 : 1.5} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="expenses"
          options={{
            title: 'Expenses',
            tabBarIcon: ({ color, size, focused }) => (
              <CreditCard strokeWidth={focused ? 2 : 1.5} size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="investments"
          options={{
            title: 'Savings',
            tabBarIcon: ({ color, size, focused }) => (
              <TrendingUp strokeWidth={focused ? 2 : 1.5} size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}