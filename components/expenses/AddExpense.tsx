import React, { useState } from 'react';
import { Text, Pressable, View, Modal } from 'react-native';
import { Image, Edit3, X,  } from 'lucide-react-native';
import CameraView from './CameraView';
import { expenseApi } from 'api/expenses';
import AddExpenseForm  from 'components/expenses/AddExpenseForm';
import { ExpenseCategory } from 'context/AppContext';

interface AddExpenseProps {
  onClose: () => void;
}

const AddExpense: React.FC<AddExpenseProps> = ({ onClose }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAddExpenseForm, setShowAddExpenseForm] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  

  const addExpensePhoto = () => {
    setShowCamera(true);
  };


  const handlePhotoTaken = async (base64: string) => {
    
    setShowAddExpenseForm(true);
    try {
    setLoading(true);
    const result = await expenseApi.orcDetection(base64);
    console.log('OCR Result:', result);
    const expenseClassification = await expenseApi.classifyExpense(result);
    console.log('Expense classification:', expenseClassification);
    setTitle(expenseClassification.expenseName);
    setAmount(expenseClassification.totalPrice.toString());
    setSelectedCategory(expenseClassification.category);
    console.log(title);
    setLoading(false);
    setShowCamera(false);
    }
    catch (error) {
      console.error('Error processing photo:', error);
      setLoading(false);
      setShowCamera(false);
    }
    finally {
      setShowCamera(false);
      setLoading(false);
    }

    
  };



  return (
    <>
      <Pressable className="flex-1 justify-end" onPress={onClose}>
        <Pressable
          className="bg-white rounded-t-2xl pt-5 pb-5 px-5 w-full shadow-lg"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-slate-800">Add Expense</Text>
            <Pressable onPress={onClose} className="p-1">
              <X size={24} color="#64748b" />
            </Pressable>
          </View>

          <View className="w-full items-center">
            <View className="w-full">
              <Pressable
                onPress={() => setShowAddExpenseForm(true)}
                className="flex-row items-center p-3.5 rounded-lg w-full active:bg-slate-50 justify-center"
              >
                <Edit3 size={22} color="black" className="mr-3" />
                <Text className="text-base font-medium text-slate-700 ml-4">Add Manually</Text>
              </Pressable>

              <View className="h-px bg-slate-200 w-full my-2" />

              <Pressable
                onPress={addExpensePhoto}
                className="flex-row items-center p-3.5 rounded-lg w-full justify-center active:bg-slate-50"
              >
                <Image size={22} color="black" className="mr-3" />
                <Text className="font-medium text-slate-700 ml-4">Add With an Image</Text>
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
        <CameraView
          onClose={() => setShowCamera(false)}
          onPhotoTaken={handlePhotoTaken}
        />
      </Modal>
      <Modal
        visible={showAddExpenseForm}
        animationType="fade"
        onRequestClose={() => setShowAddExpenseForm(false)}
        presentationStyle="overFullScreen"
        statusBarTranslucent={true}
      >
        <AddExpenseForm 
          onClose={() => setShowAddExpenseForm(false)} 
          onExpenseAdded={() => {
            setShowAddExpenseForm(false);
          }}
          classifying={loading}
          amount={amount}
          setAmount={setAmount}
          title={title}
          setTitle={setTitle}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
    </Modal>
    </>
  );
};

export default AddExpense;
