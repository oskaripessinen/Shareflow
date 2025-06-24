import { apiClient } from './client';
import {
  Expense,
  CreateExpenseRequest,
  CreateExpenseResponse,
  ExpensesResponse,
  UpdateExpenseRequest,
  ExpenseClassification,
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
      const createRequest: CreateExpenseRequest = {
        ...expenseData,
        paid_by: userId,
      };

      const response = await apiClient.post<CreateExpenseResponse>('/api/expenses', createRequest);

      if (!response.success) {
        throw new Error(response.message || 'Failed to create expense');
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getExpensesByGroupId: async (groupId: number): Promise<Expense[]> => {
    try {
      const response = await apiClient.get<ExpensesResponse>(`/api/expenses/${groupId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserExpenses: async (userId: string): Promise<Expense[]> => {
    try {
      const response = await apiClient.get<ExpensesResponse>(`/api/expenses/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getExpenseById: async (expenseId: number): Promise<Expense> => {
    try {
      const response = await apiClient.get<CreateExpenseResponse>(`/api/expenses/${expenseId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateExpense: async (
    expenseId: number,
    expenseData: UpdateExpenseRequest,
    userId: string,
  ): Promise<Expense> => {
    try {
      const response = await apiClient.put<CreateExpenseResponse>(`/api/expenses/${expenseId}`, {
        ...expenseData,
        updated_by: userId,
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to update expense');
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteExpense: async (expenseId: number, userId: string): Promise<void> => {
    try {
      await apiClient.delete<{ success: boolean }>(`/api/expenses/${expenseId}?userId=${userId}`);
    } catch (error) {
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
        `/api/expenses/range?group_id=${groupId}&start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getExpensesByCategory: async (groupId: number, category: string): Promise<Expense[]> => {
    try {
      const response = await apiClient.get<ExpensesResponse>(
        `/api/expenses/category?group_id=${groupId}&category=${category}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  classifyExpense: async (data: string): Promise<ExpenseClassification> => {
    try {
      const response = await apiClient.post<{ data: ExpenseClassification }>(
        '/api/expenses/classify',
        { data },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  orcDetection: async (base64Image: string): Promise<string> => {
    try {
      const response = await apiClient.post<{
        success: boolean;
        data?: string;
        message?: string;
      }>('/api/expenses/orc', {
        image: base64Image,
      });

      if (response.success && response.data) {
        return response.data || '';
      } else {
        throw new Error(response.message || 'OCR failed');
      }
    } catch (error) {
      throw error;
    }
  },
};
