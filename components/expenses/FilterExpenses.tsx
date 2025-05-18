import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import {
  getMonthOptions,
  getYearOptions,
  getCurrentMonth,
  getCurrentYear,
} from '@/../utils/dateUtils';
import { ExpenseFilters } from '@../../context/AppContext';

interface FilterProps {
  filters: ExpenseFilters;
  onFiltersChange: (filters: ExpenseFilters) => void;
  onClose: () => void;
}

export default function FilterExpenses({ filters, onFiltersChange, onClose }: FilterProps) {
  const monthOptions = [{ label: 'allt', value: 'all' }, ...getMonthOptions()];

  const yearOptions = [{ label: 'all', value: 'all' }, ...getYearOptions()];

  const categoryOptions = [
    { label: 'All categories', value: 'all' },
    { label: 'Food', value: 'food' },
    { label: 'Housing', value: 'housing' },
    { label: 'Transportation', value: 'transportation' },
    { label: 'Entertainment', value: 'entertainment' },
    { label: 'Utilities', value: 'utilities' },
    { label: 'Health', value: 'health' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Other', value: 'other' },
  ];

  const sortByOptions = [
    { label: 'Date', value: 'date' },
    { label: 'Amount', value: 'amount' },
  ];

  const sortOrderOptions = [
    { label: 'desc', value: 'desc' },
    { label: 'asc', value: 'asc' },
  ];

  const handleReset = () => {
    onFiltersChange({
      month: getCurrentMonth(),
      year: getCurrentYear(),
      category: 'all',
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };

  const handleApply = () => {
    onClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Filter</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#64748b" />
          </Pressable>
        </View>

        <ScrollView style={styles.filtersContainer}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Month</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={filters.month}
                onValueChange={(value) => onFiltersChange({ ...filters, month: value })}
                style={styles.picker}
              >
                {monthOptions.map((option) => (
                  <Picker.Item
                    key={option.value.toString()}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Year</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={filters.year}
                onValueChange={(value) => onFiltersChange({ ...filters, year: value })}
                style={styles.picker}
              >
                {yearOptions.map((option) => (
                  <Picker.Item
                    key={option.value.toString()}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Category</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={filters.category}
                onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
                style={styles.picker}
              >
                {categoryOptions.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Sort</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={filters.sortBy}
                onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value })}
                style={styles.picker}
              >
                {sortByOptions.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Sorting order</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={filters.sortOrder}
                onValueChange={(value) => onFiltersChange({ ...filters, sortOrder: value })}
                style={styles.picker}
              >
                {sortOrderOptions.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </View>
          </View>
        </ScrollView>

        <View style={styles.actionButtons}>
          <Pressable style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </Pressable>
          <Pressable style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply filters</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  filtersContainer: {
    flex: 1,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155', // Slate-700
    marginBottom: 8,
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 16,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#f1f5f9', // Slate-100
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  resetButtonText: {
    color: '#334155', // Slate-700
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#0891b2', // Cyan-600
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
