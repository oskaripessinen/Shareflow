import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Plus, Clock } from 'lucide-react-native';
import { Income } from '@/../context/AppContext';

interface HeaderProps {
  selectedTimeWindow: string;
  showTimeWindowPicker: boolean;
  filteredIncomes: Income[];
  setShowTimeWindowPicker: (show: boolean) => void;
  setShowAddIncomeForm: (show: boolean) => void;
  timeWindowOptions: { label: string; value: string }[];
}

const Header: React.FC<HeaderProps> = ({
  selectedTimeWindow,
  filteredIncomes,
  setShowTimeWindowPicker,
  setShowAddIncomeForm,
  timeWindowOptions,
}) => {
  const totalIncome = filteredIncomes.reduce((sum, income) => sum + Number(income.amount), 0);

  return (
   <View className="p-0 mt-0" style={{ zIndex: 10 }}>
         <View className="flex-row items-center mb-5 justify-between px-4">
           <View className="relative" style={{ zIndex: 1 }}>
             <View className="flex-row items-center bg-white rounded-xl border border-slate-200">
               <Pressable
                 onPress={() => {
                   setShowTimeWindowPicker(true);
                 }}
                 className="flex-row items-center rounded-l-lg px-3 py-3 border-r border-slate-200 text-center active:bg-slate-100"
               >
                 <Clock size={16} color="#64748b" strokeWidth={2.5} />
                 <Text className="font-medium font-semibold text-slate-700 text-base pl-2 pr-2" numberOfLines={1}>
                   {timeWindowOptions.find((opt) => opt.value === selectedTimeWindow)?.label}
                 </Text>
               </Pressable>
               <View className="py-3 px-1">
                 <Text className="font-semibold text-default px-2 text-center min-w-[100px] text-base" numberOfLines={1}>
                     {(totalIncome || 0)} €
                 </Text>
               </View>
             </View>
           </View>
           <Pressable
             onPress={() => setShowAddIncomeForm(true)}
             className="flex-row items-center bg-primary p-3 rounded-xl active:bg-primaryDark"
           >
             <Plus strokeWidth={2.2} size={18} color="#fff" />
           </Pressable>
         </View>
       </View>
  );
};

export default Header;