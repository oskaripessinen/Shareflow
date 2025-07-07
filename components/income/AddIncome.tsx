import React, { useState } from 'react';
import { Text, Pressable, View, Modal } from 'react-native';
import { Edit3, X } from 'lucide-react-native';
import AddIncomeForm from './AddIncomeForm';

interface AddIncomeProps {
  onClose: () => void;
  updateIncomes?: () => void;
}

export default function AddIncome({ onClose, updateIncomes }: AddIncomeProps) {
  const [showForm, setShowForm] = useState(false);

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    updateIncomes?.();
  };

  return (
    <>
      <Pressable className="flex-1 justify-end" onPress={onClose}>
        <Pressable
          className="bg-white rounded-t-2xl pt-5 pb-3 w-full shadow-lg"
          onPress={e => e.stopPropagation()}
        >
          <View className="flex-row justify-between items-center mb-3 mx-5">
            <Text className="text-xl font-bold text-slate-800">Add Income</Text>
            <Pressable onPress={onClose} className="p-1">
              <X size={24} color="#64748b" />
            </Pressable>
          </View>

          <Pressable
            onPress={handleShowForm}
            className="flex-row items-center p-3.5 rounded-lg active:bg-slate-50 justify-center mx-5"
          >
            <Edit3 size={22} color="black" className="mr-3" />
            <Text className="text-base font-medium text-slate-700">Add Income</Text>
          </Pressable>
        </Pressable>
      </Pressable>

      <Modal
        visible={showForm}
        animationType="fade"
        presentationStyle="overFullScreen"
        statusBarTranslucent
        onRequestClose={() => setShowForm(false)}
      >
        <AddIncomeForm
          onClose={handleCloseForm}
          onIncomeAdded={updateIncomes}
        />
      </Modal>
    </>
  );
}