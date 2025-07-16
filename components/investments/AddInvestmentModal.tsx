import React, { useState } from 'react';
import { Text, Pressable, View } from 'react-native';
import Modal from 'react-native-modal';
import { Edit3, ChartCandlestick, X } from 'lucide-react-native';

interface AddInvestmentProps {
  onClose: () => void;
}

const AddInvestment: React.FC<AddInvestmentProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  

  return (
    <>
      <Pressable className="flex-1 justify-end" onPress={onClose}>
        <Pressable
          className="bg-white rounded-t-2xl pt-5 pb-3 w-full shadow-lg"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="flex-row justify-between items-center mb-3 mx-5">
            <Text className="text-xl font-bold text-slate-800">Add Investment</Text>
            <Pressable onPress={onClose} className="p-1">
              <X size={24} color="#64748b" />
            </Pressable>
          </View>

          <View className="w-full items-center">
            <View className="w-full">
              <View className="h-px bg-slate-200 w-full mb-2 mt-1" />
              <Pressable         
                className="flex-row items-center py-3.5 rounded-lg active:bg-slate-50 justify-center w-[90%] mx-auto"
              >
                <Edit3 strokeWidth={2} size={22} color="#000000b3" className="mr-0" />
                <Text className="text-base font-semibold text-muted ml-2">Add Manually</Text>
              </Pressable>

              <View className="h-px bg-slate-200 w-[90%] mx-auto my-2" />

              <Pressable
                className="flex-row items-center p-3.5 rounded-lg justify-center active:bg-slate-50 w-[90%] mx-auto"
              >
                <ChartCandlestick strokeWidth={2} size={22} color="#000000b3" className="mr-0" />
                <Text className="font-semibold text-muted text-base ml-2">Search ticker</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>

      <Modal
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        presentationStyle="overFullScreen"
        statusBarTranslucent={true}
      >
        <View></View>
      </Modal>
      
      <Modal
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        presentationStyle="overFullScreen"
        statusBarTranslucent={true}
      >
        <View></View>
        
      </Modal>
    </>
  );
};

export default AddInvestment;