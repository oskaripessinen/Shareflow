import { ExpenseCategory } from '../types/expense';

export const expenseCategoryColors: Record<ExpenseCategory, string> = {
  food: '#3B82F6',
  transportation: '#10B981',
  health: '#F59E0B',
  housing: '#8B5CF6',
  clothing: '#EF4444',
  utilities: '#00D2D3',
  entertainment: '#008080',
  other: '#6B7280',
};

const incomeCategoryColors: Record<string, string> = {
      salary: '#3B82F6',
      freelance: '#10B981',
      investments: '#F59E0B',
      business: '#8B5CF6',
      gifts: '#EF4444',
      other: '#6B7280',
    };

export const getExpenseCategoryColor = (category: ExpenseCategory | null): string => {
  if (!category) return expenseCategoryColors.other;
  return expenseCategoryColors[category] || expenseCategoryColors.other;
};

export const getIncomeCategoryColor = (category: string): string => {
    if (!category) return expenseCategoryColors.other;
    return incomeCategoryColors[category] || incomeCategoryColors.other;
  };
