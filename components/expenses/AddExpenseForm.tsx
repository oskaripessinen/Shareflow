import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, Calendar, Euro, FileText, User } from 'lucide-react-native';
import { ExpenseCategory } from '@/../context/AppContext';
import { expenseApi } from '@/../api/expenses';
import { useGroupStore, useAuthStore } from '@/../context/AppContext';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AddExpenseFormProps {
  onClose: () => void;
  onExpenseAdded?: () => void;
  classifying?: boolean;
  initialData?: {
    title?: string;
    amount?: string;
    category?: ExpenseCategory | null;
  };
}

const expenseCategories: { label: string; value: ExpenseCategory }[] = [
  { label: 'Food', value: 'food' },
  { label: 'Housing', value: 'housing' },
  { label: 'Transportation', value: 'transportation' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Utilities', value: 'utilities' },
  { label: 'Health', value: 'health' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Other', value: 'other' },
];

export default function AddExpenseForm({
  onClose,
  onExpenseAdded,
  classifying,
  initialData = {},
}: AddExpenseFormProps) {
  const [localTitle, setLocalTitle] = useState('');
  const [localAmount, setLocalAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (initialData.title) setLocalTitle(initialData.title);
    if (initialData.amount) setLocalAmount(initialData.amount);
    if (initialData.category) setSelectedCategory(initialData.category);
  }, [initialData]);

  const onChange = (event: unknown, selectedDate?: Date) => {
    const currentDate = selectedDate || expenseDate;
    setShow(false);
    setExpenseDate(currentDate);
  };

  const currentGroup = useGroupStore((state) => state.currentGroup);
  const userId = useAuthStore((state) => state.googleId);

  const handleSubmit = async () => {
    if (!localTitle.trim() || !localAmount.trim() || isNaN(Number(localAmount)) || !currentGroup || !userId) {
      return;
    }

    setIsLoading(true);

    try {
      await expenseApi.createExpense(
        {
          group_id: currentGroup.id,
          amount: Number(localAmount),
          title: localTitle.trim(),
          description: description.trim() || undefined,
          category: selectedCategory || undefined,
          expense_date: expenseDate,
        },
        userId,
      );

      onExpenseAdded?.();
      onClose();
    } catch (error) {
      console.error('Failed to create expense:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
    >
      {classifying ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-lg text-muted mt-4">Classifying expense...</Text>
        </View>
      ) : (
        <View className="flex-1">
          <View className="flex-row items-center justify-between px-5 pt-12 pb-4 border-b border-slate-200">
            <Text className="text-xl font-semibold text-default">Add Expense</Text>
            <Pressable onPress={onClose} className="p-2 rounded-full bg-slate-200">
              <X size={22} color="#64748b" />
            </Pressable>
          </View>

          <View 
            className="flex-1 p-4"
            
          >
            <View className="mb-4">
              <Text className="text-sm font-sans text-muted mb-2">Title *</Text>
              <View className="flex-row items-center bg-slate-50 rounded-lg border border-slate-200">
                <View className="p-3">
                  <FileText size={20} color="#64748b" />
                </View>
                <TextInput
                  value={localTitle}
                  onChangeText={setLocalTitle}
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
                  value={localAmount}
                  onChangeText={setLocalAmount}
                  placeholder="0.00"
                  keyboardType="numeric"
                  className="flex-1 p-3 text-default"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-sans text-muted mb-2">Category</Text>
              <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  keyboardShouldPersistTaps='handled'
                >
                {expenseCategories.map((category) => (
                  <Pressable
                    key={category.value}
                    onPress={() =>
                      setSelectedCategory(selectedCategory === category.value ? null : category.value)
                    }
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
              <Pressable
                onPress={() => setShow(true)}
                className="flex-row items-center bg-slate-50 rounded-lg border border-slate-200 p-3"
              >
                <Calendar size={20} color="#64748b" />
                <Text className="ml-3 text-default">{expenseDate.toLocaleDateString()}</Text>
              </Pressable>
              {show && (
                <DateTimePicker value={expenseDate} mode="date" display="default" onChange={onChange} />
              )}
            </View>

            {currentGroup && (
              <View className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <View className="flex-row items-center">
                  <User size={16} color="#3B82F6" />
                  <Text className="ml-2 text-sm text-blue-700">Adding to: {currentGroup.name}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Nappi container - ei ScrollView sisällä */}
          <View className="p-4 px-5 border-t border-slate-200 bg-white">
            <Pressable
              onPress={handleSubmit}
              disabled={isLoading || !localTitle.trim() || !localAmount.trim()}
              className={`p-3 rounded-xl items-center justify-center ${
                isLoading || !localTitle.trim() || !localAmount.trim()
                  ? 'bg-slate-400'
                  : 'bg-primary active:bg-primaryDark'
              }`}
            >
              {!isLoading && (
                <Text className="text-center font-sans text-white">
                  Add Expense
                </Text>
              )}
              {isLoading && <ActivityIndicator size="small" color="white" />}
            </Pressable>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
