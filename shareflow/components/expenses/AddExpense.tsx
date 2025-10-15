import React, { useState } from 'react';
import { Text, Pressable, View, Modal } from 'react-native';
import { Image, Edit3, X, ChevronRight } from 'lucide-react-native';
import CameraView from './CameraView';
import { expenseApi } from 'api/expenses';
import AddExpenseForm from 'components/expenses/AddExpenseForm';
import { ExpenseCategory } from 'context/AppContext';

interface AddExpenseProps {
  onClose: () => void;
  updateExpenses?: () => void;
}

const AddExpense: React.FC<AddExpenseProps> = ({ onClose, updateExpenses }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAddExpenseForm, setShowAddExpenseForm] = useState(false);
  
  const [ocrResults, setOcrResults] = useState<{
    title?: string;
    amount?: string;
    category?: ExpenseCategory | null;
  }>({});

  const addExpensePhoto = () => {
    setShowCamera(true);
  };

  const handlePhotoTaken = async (base64: string) => {
    setShowAddExpenseForm(true);
    setLoading(true);
    setShowCamera(false);
    
    try {
      const result = await expenseApi.orcDetection(base64);
      const expenseClassification = await expenseApi.classifyExpense(result);

      setOcrResults({
        title: expenseClassification.expenseName,
        amount: expenseClassification.totalPrice.toString(),
        category: expenseClassification.category,
      });
    } catch (error) {
      console.error('Error processing photo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowAddExpenseForm(false);
    setOcrResults({});
    if (updateExpenses) {
      updateExpenses();
    }
  };

  const handleShowAddExpenseForm = () => {
    setOcrResults({});
    setShowAddExpenseForm(true);
  };

  return (
    <>
      <Pressable className="flex-1 justify-end" onPress={onClose}>
        <Pressable
          className="bg-white rounded-t-2xl pt-5 pb-3 w-full shadow-lg"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="flex-row justify-between items-center mb-3 mx-5">
            <Text className="text-xl font-bold text-slate-800">Add Expense</Text>
            <Pressable onPress={onClose} className="p-1">
              <X size={24} color="#64748b" />
            </Pressable>
          </View>

          <View className="w-full items-center">
            <View className="w-full">
              <View className="h-px bg-slate-200 w-full mb-2 mt-1" />
              <Pressable
                onPress={handleShowAddExpenseForm}
                className="flex-row p-3.5 rounded-lg items-center active:bg-slate-50 w-[90%] mx-auto justify-between"
              >
                <View className='flex-row'>
                  <Edit3 strokeWidth={2} size={22} color="#000000b3" className="mr-0" />
                  <Text className="text-base font-semibold text-muted ml-4">Manually</Text>
                </View>
                <ChevronRight strokeWidth={1.8} color="#000000b3"/>
              </Pressable>

              <View className="h-px bg-slate-200 w-[90%] mx-auto my-2" />

              <Pressable
                onPress={addExpensePhoto}
                className="flex-row p-3.5 rounded-lg items-center active:bg-slate-50 w-[90%] mx-auto justify-between"
              >
                <View className='flex-row'>
                  <Image strokeWidth={2} size={22} color="#000000b3" className="mr-3" />
                  <Text className="font-semibold text-muted text-base ml-4">With Image</Text>
                </View>
                <ChevronRight strokeWidth={1.8} color="#000000b3"/>
                
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>

      <Modal
        visible={showCamera}
        animationType="fade"
        presentationStyle="fullScreen"
        statusBarTranslucent={true}
      >
        <CameraView onClose={() => setShowCamera(false)} onPhotoTaken={handlePhotoTaken} />
      </Modal>
      
      <Modal
        visible={showAddExpenseForm}
        animationType="fade"
        onRequestClose={() => setShowAddExpenseForm(false)}
        presentationStyle="overFullScreen"
        statusBarTranslucent={true}
      >
        <AddExpenseForm
          onClose={handleClose}
          onExpenseAdded={() => {
            setShowAddExpenseForm(false);
          }}
          classifying={loading}
          initialData={ocrResults}
        />
      </Modal>
    </>
  );
};

export default AddExpense;
