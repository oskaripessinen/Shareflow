import { Income, IncomeCategory } from '@/../context/AppContext';

export const incomeApi = {
  getIncomesByGroupId: async (groupId: string | number): Promise<Income[]> => {
    try {
      console.log('Fetching incomes for group:', groupId);
      return [];
    } catch (error) {
      console.error('Error fetching incomes:', error);
      throw error;
    }
  },
  
  createIncome: async (
    incomeData: {
      group_id: number;
      title: string;
      amount: number;
      category?: IncomeCategory;
      description?: string;

    },
    userId: string
  ): Promise<Income> => {
    try {
      console.log('Creating income:', incomeData);
      const newIncome: Income = {
        id: Date.now().toString(),
        title: incomeData.title,
        amount: incomeData.amount,
        category: incomeData.category || 'other',
        description: incomeData.description,
        created_at: new Date(),
        group_id: incomeData.group_id,
        user_id: userId,
      };
      return newIncome;
    } catch (error) {
      console.error('Error creating income:', error);
      throw error;
    }
  },
};