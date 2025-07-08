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
  const totalIncome = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);

  return (
   <View className="p-0 mt-0" style={{ zIndex: 10 }}>
         <View className="flex-row items-center mb-5 justify-between px-4">
           <View className="relative" style={{ zIndex: 1 }}>
             <View className="flex-row items-center bg-white rounded-xl border border-slate-200">
               <Pressable
                 onPress={() => {
                   setShowTimeWindowPicker(true);
                 }}
                 style={{
                   minWidth: 120,
                   height: '100%',
                   paddingHorizontal: 20,
                   justifyContent: 'center',
                 }}
                 className="flex-row items-center my-0 py-0 rounded-l-xl pl-3 pr-1 border-r border-slate-200 text-center active:bg-slate-100"
               >
                 <Clock size={16} color="#64748b" strokeWidth={2.5} />
                 <Text className="font-medium font-semibold text-slate-700 text-base pl-2 pr-2" numberOfLines={1}>
                   {timeWindowOptions.find((opt) => opt.value === selectedTimeWindow)?.label}
                 </Text>
               </Pressable>
               <View className="p-3 pl-3">
                 <Text className="font-semibold text-default px-2 text-center min-w-[100px] text-base" numberOfLines={1}>
                     {(totalIncome || 0)} €
                 </Text>
               </View>
             </View>
           </View>
           <Pressable
             onPress={() => setShowAddIncomeForm(true)}
             className="flex-row items-center bg-primary pr-4 pl-2.5 py-2 rounded-xl active:bg-primaryDark shadow gap-1"
           >
             <Plus strokeWidth={2.2} size={18} color="#fff" />
             <Text className='text-white font-sans text-base'>Income</Text>
           </Pressable>
         </View>
       </View>
  );
};

export default Header;