
import { ExpenseCategory } from '../types/expense';

export const categoryColors: Record<ExpenseCategory, string> = {
  food: '#3B82F6',
  transportation: '#10B981', 
  health: '#F59E0B',
  housing: '#8B5CF6', 
  clothing: '#EF4444',     
  utilities: '#00D2D3',    
  entertainment: '#008080',
  other: '#6B7280',         
};


export const getCategoryColor = (category: ExpenseCategory | null): string => {
  if (!category) return categoryColors.other;
  return categoryColors[category] || categoryColors.other;
};

export const getAllCategoryColors = (): Array<{ category: ExpenseCategory; color: string }> => {
  return Object.entries(categoryColors).map(([category, color]) => ({
    category: category as ExpenseCategory,
    color,
  }));
};