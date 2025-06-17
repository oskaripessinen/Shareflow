import { apiClient } from './client';
import {
  Expense,
  CreateExpenseRequest,
  CreateExpenseResponse,
  ExpensesResponse,
  UpdateExpenseRequest,
} from '../types/expense';

export const expenseApi = {
  createExpense: async (
    expenseData: {
      group_id: number;
      amount: number;
      title: string;
      description?: string;
      category?: string;
      expense_date?: Date;
    },
    userId: string,
  ): Promise<Expense> => {
    try {
      console.log('Creating expense:', expenseData);
      console.log('User ID:', userId);
      
      const createRequest: CreateExpenseRequest = {
        ...expenseData,
        paid_by: userId,
      };

      const response = await apiClient.post<CreateExpenseResponse>('/api/expenses', createRequest);

      if (!response.success) {
        throw new Error(response.message || 'Failed to create expense');
      }

      console.log('Expense created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to create expense:', error);
      throw error;
    }
  },

  getExpensesByGroupId: async (groupId: number): Promise<Expense[]> => {
    try {
      const response = await apiClient.get<ExpensesResponse>(`/api/expenses/${groupId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
      throw error;
    }
  },

  getUserExpenses: async (userId: string): Promise<Expense[]> => {
    try {
      const response = await apiClient.get<ExpensesResponse>(`/api/expenses/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user expenses:', error);
      throw error;
    }
  },

  getExpenseById: async (expenseId: number): Promise<Expense> => {
    try {
      const response = await apiClient.get<CreateExpenseResponse>(`/api/expenses/${expenseId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch expense:', error);
      throw error;
    }
  },

  updateExpense: async (
    expenseId: number,
    expenseData: UpdateExpenseRequest,
    userId: string,
  ): Promise<Expense> => {
    try {
      console.log('Updating expense:', expenseId, expenseData);
      
      const response = await apiClient.put<CreateExpenseResponse>(
        `/api/expenses/${expenseId}`,
        {
          ...expenseData,
          updated_by: userId,
        }
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to update expense');
      }

      console.log('Expense updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to update expense:', error);
      throw error;
    }
  },

  deleteExpense: async (expenseId: number, userId: string): Promise<void> => {
    try {
      await apiClient.delete<{ success: boolean }>(
        `/api/expenses/${expenseId}?userId=${userId}`
      );
      console.log('Expense deleted successfully:', expenseId);
    } catch (error) {
      console.error('Failed to delete expense:', error);
      throw error;
    }
  },

  getExpensesByDateRange: async (
    groupId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Expense[]> => {
    try {
      const response = await apiClient.get<ExpensesResponse>(
        `/api/expenses/range?group_id=${groupId}&start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch expenses by date range:', error);
      throw error;
    }
  },

  getExpensesByCategory: async (groupId: number, category: string): Promise<Expense[]> => {
    try {
      const response = await apiClient.get<ExpensesResponse>(
        `/api/expenses/category?group_id=${groupId}&category=${category}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch expenses by category:', error);
      throw error;
    }
  },

  classifyExpense: async (data: string): Promise<string> => {
    try {
      const response = await apiClient.post<{ category: string }>(
        '/api/expenses/classify',
        { data }
      );
      return response.category;
    } catch (error) {
      console.error('Failed to classify expense:', error);
      throw error;
    }
  },

  orcDetection: async (base64Image: string): Promise<string> => {
    try {
      console.log('Sending OCR request with base64 image');

      const response = await apiClient.post<{
        success: boolean;
        data?: { text: string };
        message?: string;
      }>('/api/expenses/orc', {
        image: base64Image
      });

      if (response.success && response.data) {
        return response.data.text || '';
      } else {
        throw new Error(response.message || 'OCR failed');
      }
    } catch (error) {
      console.error('OCR detection failed:', error);
      throw error;
    }
  },

};