import React, { useState } from 'react';
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
import { X } from 'lucide-react-native';
import { useAppContext } from '@/../context/AppContext';
import { Picker } from '@react-native-picker/picker';
import { getMonthOptions, getYearOptions } from '@/../utils/dateUtils';

export default function AddGoalForm({ onClose }: { onClose: () => void }) {
  const { addGoal } = useAppContext();
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetMonth, setTargetMonth] = useState(1);
  const [targetYear, setTargetYear] = useState(new Date().getFullYear() + 1);
  const [color, setColor] = useState('#0891b2'); // Default color
  const [error, setError] = useState<string | null>(null);

  const colorOptions = [
    { label: 'Sininen', value: '#0891b2' }, // Cyan-600
    { label: 'Vihreä', value: '#10b981' }, // Emerald-500
    { label: 'Violetti', value: '#8b5cf6' }, // Violet-500
    { label: 'Oranssi', value: '#f59e0b' }, // Amber-500
    { label: 'Punainen', value: '#ef4444' }, // Red-500
    { label: 'Pinkki', value: '#ec4899' }, // Pink-500
  ];

  const handleAddGoal = () => {
    // Validate form
    if (!title) {
      setError('Anna tavoitteen nimi');
      return;
    }

    if (!targetAmount || isNaN(parseFloat(targetAmount)) || parseFloat(targetAmount) <= 0) {
      setError('Anna kelvollinen tavoitesumma');
      return;
    }

    if (!currentAmount || isNaN(parseFloat(currentAmount)) || parseFloat(currentAmount) < 0) {
      setError('Anna kelvollinen nykyinen summa');
      return;
    }

    if (parseFloat(currentAmount) > parseFloat(targetAmount)) {
      setError('Nykyinen summa ei voi olla suurempi kuin tavoitesumma');
      return;
    }

    // Create target date
    const targetDate = new Date(targetYear, targetMonth - 1, 1);

    const newGoal = {
      id: Date.now().toString(),
      title,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount),
      targetDate: targetDate.toISOString(),
      color,
    };

    addGoal(newGoal);
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
            <Text style={styles.title}>Lisää tavoite</Text>
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
              <Text style={styles.label}>Tavoitteen nimi</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Esim. Lomamatka"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Tavoitesumma (€)</Text>
              <TextInput
                style={styles.input}
                value={targetAmount}
                onChangeText={setTargetAmount}
                keyboardType="numeric"
                placeholder="0.00"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nykyinen säästö (€)</Text>
              <TextInput
                style={styles.input}
                value={currentAmount}
                onChangeText={setCurrentAmount}
                keyboardType="numeric"
                placeholder="0.00"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Tavoitekuukausi</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={targetMonth}
                  onValueChange={(itemValue) => setTargetMonth(itemValue)}
                  style={styles.picker}
                >
                  {getMonthOptions().map((option) => (
                    <Picker.Item
                      key={option.value.toString()}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Tavoitevuosi</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={targetYear}
                  onValueChange={(itemValue) => setTargetYear(itemValue)}
                  style={styles.picker}
                >
                  {getYearOptions().map((option) => (
                    <Picker.Item
                      key={option.value.toString()}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Väri</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={color}
                  onValueChange={(itemValue) => setColor(itemValue)}
                  style={styles.picker}
                >
                  {colorOptions.map((option) => (
                    <Picker.Item key={option.value} label={option.label} value={option.value} />
                  ))}
                </Picker>
              </View>
            </View>

            <Pressable style={styles.addButton} onPress={handleAddGoal}>
              <Text style={styles.addButtonText}>Lisää tavoite</Text>
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
    maxHeight: '90%',
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
