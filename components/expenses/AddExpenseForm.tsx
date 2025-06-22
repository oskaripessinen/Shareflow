import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Animated
} from 'react-native';
import { X, Calendar, Euro, FileText, User } from 'lucide-react-native';
import { ExpenseCategory } from '@/../context/AppContext';
import { expenseApi } from '@/../api/expenses';
import { useGroupStore, useAuthStore } from '@/../context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';


interface AddExpenseFormProps {
  onClose: () => void;
  onExpenseAdded?: () => void;
  setShowAddExpenseModal?: (show: boolean) => void;
  updateExpenses?: () => void;
  classifying?: boolean;
  amount: string;
  setAmount: (amount: string) => void;
  title: string;
  setTitle: (title: string) => void;
  selectedCategory: ExpenseCategory | null;
  setSelectedCategory: (category: ExpenseCategory | null) => void;
}

const expenseCategories: { label: string; value: ExpenseCategory; }[] = [
  { label: 'Food', value: 'food'},
  { label: 'Housing', value: 'housing' },
  { label: 'Transportation', value: 'transportation'},
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Utilities', value: 'utilities' },
  { label: 'Health', value: 'health' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Other', value: 'other' },
];

export default function AddExpenseForm({ 
  onClose, 
  onExpenseAdded, 
  setShowAddExpenseModal, 
  classifying, 
  amount, 
  setAmount, 
  title, 
  setTitle, 
  selectedCategory, 
  setSelectedCategory }: AddExpenseFormProps) {
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [show, setShow] = useState(false);

  const onChange = (event: unknown, selectedDate?: Date) => {
    const currentDate = selectedDate || expenseDate;
    setShow(false);
    setExpenseDate(currentDate);
  };

  const currentGroup = useGroupStore((state) => state.currentGroup);
  const userId = useAuthStore((state) => state.googleId);

  const handleSubmit = async () => {
    setShowAddExpenseModal?.(false);
    if (!title.trim()) {
      return;
    }
    
    if (!amount.trim() || isNaN(Number(amount))) {
      return;
    }
    
    if (!currentGroup) {
      return;
    }

    setIsLoading(true);
    
    try {
      if (!userId) {
        return;
      }
      await expenseApi.createExpense(
        {
          group_id: currentGroup.id,
          amount: Number(amount),
          title: title.trim(),
          description: description.trim() || undefined,
          category: selectedCategory || undefined,
          expense_date: expenseDate,
        },
        userId
      );

      onExpenseAdded?.();
      onClose();
      
      
    } catch (error) {
      console.error('Failed to create expense:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const Form = () => (
    <Animated.View className="flex-1 bg-white">

        <View className="flex-row items-center justify-between px-5 pb-5 border-b border-slate-200">
          <Text className="text-xl font-semibold text-default">Add Expense</Text>
          <Pressable
            onPress={onClose}
            className="p-2 rounded-full bg-slate-200 active:bg-slate-200"
          >
            <X size={22} color="#64748b" />
          </Pressable>
        </View>

        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
          <View className="mb-4">
            <Text className="text-sm font-sans text-muted mb-2">Title *</Text>
            <View className="flex-row items-center bg-slate-50 rounded-lg border border-slate-200">
              <View className="p-3">
                <FileText size={20} color="#64748b" />
              </View>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Enter expense title"
                className="flex-1 p-3 text-default"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-sans text-muted mb-2">Amount *</Text>
            <View className="flex-row items-center bg-slate-50 rounded-lg border border-slate-200">
              <View className="p-3">
                <Euro size={20} color="#64748b" />
              </View>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                keyboardType="numeric"
                className="flex-1 p-3 text-default"
                placeholderTextColor="#94a3b8"
              />
              <View className="p-3">
              </View>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-sans text-muted mb-2">Category</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              {expenseCategories.map((category) => (
                <Pressable
                  key={category.value}
                  onPress={() => setSelectedCategory(
                    selectedCategory === category.value ? null : category.value
                  )}
                  className={`mr-3 p-2 rounded-full border-2 min-w-[80px] items-center ${
                    selectedCategory === category.value
                      ? 'border-primary bg-primary/10'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <Text 
                    className={`text-xs font-medium ${
                      selectedCategory === category.value ? 'text-primary' : 'text-muted'
                    }`}
                  >
                    {category.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-sans text-muted mb-2">Description</Text>
            <View className="bg-slate-50 rounded-lg border border-slate-200">
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description (optional)"
                multiline
                numberOfLines={3}
                className="p-3 text-default"
                placeholderTextColor="#94a3b8"
                textAlignVertical="top"
              />
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-sm font-sans text-muted mb-2">Date</Text>
            <Pressable onPress={() => setShow(true)} className="flex-row items-center bg-slate-50 rounded-lg border border-slate-200 p-3">
              <Calendar size={20} color="#64748b" />
              <Text className="ml-3 text-default">
                {expenseDate.toLocaleDateString()}
              </Text>
            </Pressable>
            {show && (
              <DateTimePicker
                value={expenseDate}
                mode="date"
                display="default"
                onChange={onChange}
              />
            )}
          </View>

          {currentGroup && (
            <View className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <View className="flex-row items-center">
                <User size={16} color="#3B82F6" />
                <Text className="ml-2 text-sm text-blue-700">
                  Adding to: {currentGroup.name}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View className="p-4 border-t border-slate-200">
          <View className="flex-row space-x-3">

            <Pressable
              onPress={handleSubmit}
              disabled={isLoading || title === '' || amount === ''}
              className={`flex-1 p-4 rounded-lg flex-row items-center justify-center gap-4
                ${isLoading ? 'bg-slate-300' : 'bg-primary active:bg-primaryDark'}
                ${title === '' ? 'bg-slate-400' : 'bg-primary active:bg-cyan-700'}
                ${amount === '' ? 'bg-slate-400' : 'bg-primary active:bg-cyan-700'}`
            }
            >
              <Text className="text-center font-medium text-white">
                {isLoading ? '' : 'Add Expense'}
              </Text>
              {isLoading && <ActivityIndicator color="white"/>}
            </Pressable>
          </View>
        </View>
      </Animated.View>
  );

  return (
    <SafeAreaView
      className="flex-1" 
    >
      <View className="flex-1 bg-background">
        {classifying ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-lg text-muted mt-4">Classifying expense...</Text>
          </View>
        ) : (
          <Form />
        )}
      </View>
    </SafeAreaView>
  );
}

