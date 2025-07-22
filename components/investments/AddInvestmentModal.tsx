import React, { useState } from 'react';
import { Text, Pressable, View } from 'react-native';
import Modal from 'react-native-modal';
import { Edit3, ChartCandlestick, X, ChevronRight } from 'lucide-react-native';
import SearchModal from './SearchModal';

interface AddInvestmentProps {
  onClose: () => void;
}

const AddInvestment: React.FC<AddInvestmentProps> = ({ onClose }) => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  
  const handleCloseSearchModal = () => {
    setShowSearchModal(false);
  }

  const handleShowSearchModal = () => {
    setShowSearchModal(true);
  }

  return (
    <>
      {!showSearchModal && (
        <Pressable className="flex-1 justify-end" onPress={onClose}>
          <Pressable
            className="bg-white rounded-t-2xl pt-5 pb-3 w-full shadow-lg"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row justify-between items-center mb-3 mx-5">
              <Text className="text-xl font-bold text-slate-800">Add Investments</Text>
              <Pressable onPress={onClose} className="p-1">
                <X size={24} color="#64748b" />
              </Pressable>
            </View>

            <View className="w-full items-center">
              <View className="w-full">
                <View className="h-px bg-slate-200 w-full mb-2 mt-1" />
                <Pressable         
                  className="flex-row p-3.5 rounded-lg active:bg-slate-50 w-[90%] mx-auto justify-between"
                >
                  <View className='flex-row'>
                    <Edit3 strokeWidth={2} size={22} color="#000000b3"/>
                    <Text numberOfLines={1} className="text-base font-semibold text-muted ml-4">Manually</Text>
                  </View>
                  <ChevronRight strokeWidth={1.8} color="#000000b3"/>
                </Pressable>

                <View className="h-px bg-slate-200 w-[90%] mx-auto my-2" />

                <Pressable
                  onPress={handleShowSearchModal}
                  className="flex-row items-center justify-between p-3.5 rounded-lg active:bg-slate-50 w-[90%] mx-auto"
                >
                  <View className='flex-row'>
                    <ChartCandlestick strokeWidth={2} size={22} color="#000000b3" className="mr-0" />
                    <Text className="font-semibold text-muted text-base ml-4">Search ticker</Text>
                  </View>
                  <ChevronRight strokeWidth={1.8} color="#000000b3"/>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Pressable>
      )}

      <Modal
        isVisible={showSearchModal}
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={{ margin: 0 }}
        statusBarTranslucent={true}
        backdropOpacity={0.5}
        swipeDirection={[]}
      >
        <SearchModal onClose={handleCloseSearchModal}/>
      </Modal>
    </>
  );
};

export default AddInvestment;