import { apiClient } from './client';
import { Income } from '@/../context/AppContext';
import { CreateIncomeRequest, IncomeResponse, CreateIncomeProps, CreateIncomeResponse } from 'types/income'; 

export const incomeApi = {
  getIncomesByGroupId: async (groupId: number): Promise<Income[]> => {
    try {
      const response = await apiClient.get<IncomeResponse>(`/api/income/${groupId}`);
      return response.data; 
    }catch(error) {
      throw error;
    }
  },
  
  createIncome: async (
    incomeData: CreateIncomeProps,
    userId: string
  ): Promise<Income> => {
    try {
      console.log('Creating income:', incomeData);
      const createRequest: CreateIncomeRequest = {
        ...incomeData,
        userId: userId,
      }
      const response = await apiClient.post<CreateIncomeResponse>('/api/income',createRequest)
      if (!response.success) {
        throw new Error("Failed to add income!")
      }
      return response.data;
    } catch (error) {
      console.error('Error creating income:', error);
      throw error;
    }
  },
};