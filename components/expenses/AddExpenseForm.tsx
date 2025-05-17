import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { X, Camera } from 'lucide-react-native';
import { useAppContext, ExpenseCategory } from '@/../context/AppContext';
import { Picker } from '@react-native-picker/picker';

export default function AddExpenseForm({ onClose }: { onClose: () => void }) {
  const { addExpense } = useAppContext();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [error, setError] = useState<string | null>(null);

  const categoryOptions = [
    { label: 'Food', value: 'food' },
    { label: 'Housing', value: 'housing' },
    { label: 'Transportation', value: 'transportation' },
    { label: 'Entertaiment', value: 'entertainment' },
    { label: 'Utilities', value: 'utilities' },
    { label: 'Health', value: 'health' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Other', value: 'other' },
  ];

  const handleAddExpense = () => {
    if (!amount || isNaN(parseFloat(amount))) {
      setError('Give a valid amount');
      return;
    }

    if (!description) {
      setError('give a valid description');
      return;
    }

    const newExpense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      description,
      category: category,
      date: new Date().toISOString(),
    };

    addExpense(newExpense);
    onClose();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoid}
    >
      <View style={styles.container}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Add expense</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#64748b" />
            </Pressable>
          </View>

          <ScrollView style={styles.form}>
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.formGroup}>
              <Text style={styles.label}>Amount (€)</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0.00"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Expense description"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={category}
                  onValueChange={(itemValue) => setCategory(itemValue)}
                  style={styles.picker}
                >
                  {categoryOptions.map((option) => (
                    <Picker.Item key={option.value} label={option.label} value={option.value} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Receipt</Text>
              <Pressable style={styles.cameraButton}>
                <Camera size={24} color="#0891b2" />
                <Text style={styles.cameraText}>Add receipt</Text>
              </Pressable>
            </View>

            <Pressable style={styles.addButton} onPress={handleAddExpense}>
              <Text style={styles.addButtonText}>Add expense</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    height: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a', // Slate-900
  },
  closeButton: {
    padding: 4,
  },
  form: {
    flex: 1,
  },
  errorContainer: {
    backgroundColor: '#fee2e2', // Red-100
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#ef4444', // Red-500
    fontSize: 14,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155', // Slate-700
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc', // Slate-50
    borderWidth: 1,
    borderColor: '#e2e8f0', // Slate-200
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#f8fafc', // Slate-50
    borderWidth: 1,
    borderColor: '#e2e8f0', // Slate-200
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0f2fe', // Cyan-100
    borderRadius: 8,
    padding: 12,
  },
  cameraText: {
    color: '#0891b2', // Cyan-600
    fontWeight: '500',
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: '#0891b2', // Cyan-600
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
