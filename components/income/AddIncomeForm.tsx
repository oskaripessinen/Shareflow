import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { X, Calendar, Euro, FileText, User } from 'lucide-react-native';
import { IncomeCategory } from '@/../context/AppContext';
import { incomeApi } from '@/../api/income';
import { useGroupStore, useAuthStore } from '@/../context/AppContext';
import DateTimePicker from '@react-native-community/datetimepicker';

interface AddIncomeFormProps {
  onClose: () => void;
  onIncomeAdded?: () => void;
}

const incomeCategories: { label: string; value: IncomeCategory }[] = [
  { label: 'Salary', value: 'salary' },
  { label: 'Freelance', value: 'freelance' },
  { label: 'Investments', value: 'investments' },
  { label: 'Business', value: 'business' },
  { label: 'Gifts', value: 'gifts' },
  { label: 'Other', value: 'other' },
];

export default function AddIncomeForm({
  onClose,
  onIncomeAdded,
}: AddIncomeFormProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IncomeCategory | null>(null);
  const [incomeDate, setIncomeDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (event: unknown, selectedDate?: Date) => {
    const currentDate = selectedDate || incomeDate;
    setShow(false);
    setIncomeDate(currentDate);
  };

  const currentGroup = useGroupStore((state) => state.currentGroup);
  const userId = useAuthStore((state) => state.googleId);

  const handleSubmit = async () => {
    if (!title.trim() || !amount.trim() || isNaN(Number(amount)) || !currentGroup || !userId) {
      return;
    }

    setIsLoading(true);

    try {
      await incomeApi.createIncome(
        {
          group_id: currentGroup.id,
          title: title.trim(),
          amount: Number(amount),
          category: selectedCategory || 'other',
          description: description.trim() || undefined,
          income_date: incomeDate,
        },
        userId,
      );

      onIncomeAdded?.();
      onClose();
    } catch (error) {
      console.error('Failed to create income:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-5 pt-12 pb-4 border-b border-slate-200">
        <Text className="text-xl font-semibold text-default">Add Income</Text>
        <Pressable onPress={onClose} className="p-2 rounded-full bg-slate-200">
          <X size={22} color="#64748b" />
        </Pressable>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="mb-4">
          <Text className="text-sm font-sans text-muted mb-2">Title *</Text>
          <View className="flex-row items-center bg-slate-50 rounded-lg border border-slate-200">
            <View className="p-3">
              <FileText size={20} color="#64748b" />
            </View>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter income title"
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
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-sans text-muted mb-2">Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {incomeCategories.map((category) => (
              <Pressable
                key={category.value}
                onPress={() =>
                  setSelectedCategory(selectedCategory === category.value ? null : category.value)
                }
                className={`mr-3 p-2 rounded-full border-2 min-w-[80px] items-center ${
                  selectedCategory === category.value
                    ? 'border-green-500 bg-green-100'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <Text
                  className={`text-xs font-medium ${
                    selectedCategory === category.value ? 'text-green-600' : 'text-muted'
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
            <Text className="ml-3 text-default">{incomeDate.toLocaleDateString()}</Text>
          </Pressable>
          {show && (
            <DateTimePicker value={incomeDate} mode="date" display="default" onChange={onChange} />
          )}
        </View>

        {currentGroup && (
          <View className="mb-6 p-3 bg-green-50 rounded-lg border border-green-200">
            <View className="flex-row items-center">
              <User size={16} color="#10B981" />
              <Text className="ml-2 text-sm text-green-700">Adding to: {currentGroup.name}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View className="p-4 border-t border-slate-200 bg-white">
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading || !title.trim() || !amount.trim()}
          className={`p-3 rounded-xl items-center justify-center ${
            isLoading || !title.trim() || !amount.trim()
              ? 'bg-slate-400'
              : 'bg-green-600 active:bg-green-700'
          }`}
        >
          {!isLoading && (
            <Text className="text-center font-semibold text-white">
              Add Income
            </Text>
          )}
          {isLoading && <ActivityIndicator size="small" color="white" />}
        </TouchableOpacity>
      </View>
    </View>
  );
}