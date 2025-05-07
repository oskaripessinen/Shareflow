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

export default function AddInvestmentForm({ onClose }: { onClose: () => void }) {
  const { addInvestment } = useAppContext();
  const [name, setName] = useState('');
  const [type, setType] = useState('stock');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [error, setError] = useState<string | null>(null);

  const typeOptions = [
    { label: 'Osake', value: 'stock' },
    { label: 'Rahasto', value: 'fund' },
    { label: 'Kryptovaluutta', value: 'crypto' },
    { label: 'ETF', value: 'etf' },
    { label: 'Joukkovelkakirja', value: 'bond' },
    { label: 'Muu', value: 'other' },
  ];

  const handleAddInvestment = () => {
    // Validate form
    if (!name) {
      setError('Anna sijoituksen nimi');
      return;
    }

    if (!quantity || isNaN(parseFloat(quantity)) || parseFloat(quantity) <= 0) {
      setError('Anna kelvollinen määrä');
      return;
    }

    if (!purchasePrice || isNaN(parseFloat(purchasePrice)) || parseFloat(purchasePrice) <= 0) {
      setError('Anna kelvollinen ostohinta');
      return;
    }

    if (!currentPrice || isNaN(parseFloat(currentPrice)) || parseFloat(currentPrice) <= 0) {
      setError('Anna kelvollinen nykyinen hinta');
      return;
    }

    const newInvestment = {
      id: Date.now().toString(),
      name,
      type: type as any,
      quantity: parseFloat(quantity),
      purchasePrice: parseFloat(purchasePrice),
      currentPrice: parseFloat(currentPrice),
      purchaseDate: new Date().toISOString(),
    };

    addInvestment(newInvestment);
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
            <Text style={styles.title}>Lisää sijoitus</Text>
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
              <Text style={styles.label}>Nimi</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Sijoituksen nimi"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Tyyppi</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={type}
                  onValueChange={(itemValue) => setType(itemValue)}
                  style={styles.picker}
                >
                  {typeOptions.map((option) => (
                    <Picker.Item
                      key={option.value}
                      label={option.label}
                      value={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Määrä</Text>
              <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder="1"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Ostohinta (€)</Text>
              <TextInput
                style={styles.input}
                value={purchasePrice}
                onChangeText={setPurchasePrice}
                keyboardType="numeric"
                placeholder="0.00"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nykyinen hinta (€)</Text>
              <TextInput
                style={styles.input}
                value={currentPrice}
                onChangeText={setCurrentPrice}
                keyboardType="numeric"
                placeholder="0.00"
              />
            </View>

            <Pressable style={styles.addButton} onPress={handleAddInvestment}>
              <Text style={styles.addButtonText}>Lisää sijoitus</Text>
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