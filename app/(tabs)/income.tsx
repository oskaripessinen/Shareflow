import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { Landmark } from 'lucide-react-native'; 

export default function IncomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center p-4">
        <Landmark size={48} color="#16A34A" className="mb-4" />
        <Text className="text-2xl font-bold text-slate-800 mb-2">Income Tracking</Text>
        <Text className="text-base text-slate-600 text-center">
          This is where you will manage and view your income.
        </Text>
      </View>
    </SafeAreaView>
  );
}