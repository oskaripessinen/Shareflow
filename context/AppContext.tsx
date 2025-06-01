import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../utils/supabase';

export type ExpenseCategory =
  | 'food'
  | 'housing'
  | 'transportation'
  | 'entertainment'
  | 'utilities'
  | 'health'
  | 'clothing'
  | 'other';

export type InvestmentType = 'stock' | 'fund' | 'crypto' | 'etf' | 'bond' | 'other';

export type ExpenseFilters = {
  month: number | 'all';
  year: number | 'all';
  category: ExpenseCategory | 'all';
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
};

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: string;
  receiptImage?: string;
}

export interface Investment {
  id: string;
  name: string;
  type: InvestmentType;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  color: string;
}

interface Income {
  amount: number;
  isGross: boolean;
}

interface Savings {
  target: number;
}

interface AuthState {
  googleId: string | null;
  authLoading: boolean;
  
  setGoogleId: (id: string | null) => void;
  setAuthLoading: (loading: boolean) => void;
  signOut: () => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  googleId: null,
  authLoading: true,
  
  setGoogleId: (googleId) => set({ googleId }),
  setAuthLoading: (authLoading) => set({ authLoading }),
  
  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({googleId: null });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },
  
  initializeAuth: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({
        googleId: session?.user?.id ?? null,
        authLoading: false,
      });
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        googleId: session?.user?.id ?? null,
        authLoading: false,
      });
    });
  },
}));

interface AppState {
  income: Income;
  expenses: Expense[];
  investments: Investment[];
  goals: Goal[];
  savings: Savings;
  showTimeWindowPicker: boolean;

  setIncome: (income: Income) => void;
  setSavingsTarget: (target: number) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  addInvestment: (investment: Investment) => void;
  updateInvestment: (investment: Investment) => void;
  deleteInvestment: (id: string) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  setShowTimeWindowPicker: (show: boolean) => void;
  loadSampleData: () => void;
  resetState: () => void;
}

const initialState = {
  income: {
    amount: 0,
    isGross: false,
  },
  expenses: [],
  investments: [],
  goals: [],
  savings: {
    target: 0,
  },
  showTimeWindowPicker: false,
};

const sampleData = {
  income: {
    amount: 3200,
    isGross: false,
  },
  expenses: [
    {
      id: '1',
      amount: 850,
      description: 'Rent',
      category: 'housing' as ExpenseCategory,
      date: '2025-05-01T12:00:00Z',
    },
    {
      id: '2',
      amount: 350,
      description: 'Groceries',
      category: 'food' as ExpenseCategory,
      date: '2025-05-05T14:30:00Z',
    },
    {
      id: '3',
      amount: 120,
      description: 'Phone and Internet',
      category: 'utilities' as ExpenseCategory,
      date: '2025-05-10T09:15:00Z',
    },
    {
      id: '4',
      amount: 75,
      description: 'Movie and Dinner',
      category: 'entertainment' as ExpenseCategory,
      date: '2025-05-15T18:45:00Z',
    },
    {
      id: '5',
      amount: 200,
      description: 'Monthly Bus Pass',
      category: 'transportation' as ExpenseCategory,
      date: '2025-05-02T10:00:00Z',
    },
  ],
  investments: [
    {
      id: '1',
      name: 'Global Index Fund',
      type: 'fund' as InvestmentType,
      quantity: 10,
      purchasePrice: 100,
      currentPrice: 108,
      purchaseDate: '2025-01-15T12:00:00Z',
    },
    {
      id: '2',
      name: 'Apple Inc.',
      type: 'stock' as InvestmentType,
      quantity: 50,
      purchasePrice: 150,
      currentPrice: 165,
      purchaseDate: '2025-02-20T12:00:00Z',
    },
    {
      id: '3',
      name: 'Bitcoin',
      type: 'crypto' as InvestmentType,
      quantity: 0.05,
      purchasePrice: 30000,
      currentPrice: 35000,
      purchaseDate: '2025-03-10T12:00:00Z',
    },
  ],
  goals: [
    {
      id: '1',
      title: 'Vacation',
      targetAmount: 1500,
      currentAmount: 800,
      targetDate: '2025-08-01T12:00:00Z',
      color: '#0891b2',
    },
    {
      id: '2',
      title: 'New Computer',
      targetAmount: 1200,
      currentAmount: 450,
      targetDate: '2025-11-15T12:00:00Z',
      color: '#14b8a6',
    },
  ],
  savings: {
    target: 500,
  },
  showTimeWindowPicker: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setIncome: (income) => set({ income }),
      setSavingsTarget: (target) => set((state) => ({ 
        savings: { ...state.savings, target } 
      })),
      
      addExpense: (expense) => set((state) => ({ 
        expenses: [...state.expenses, expense] 
      })),
      updateExpense: (expense) => set((state) => ({
        expenses: state.expenses.map((exp) =>
          exp.id === expense.id ? expense : exp
        ),
      })),
      deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter((exp) => exp.id !== id),
      })),
      
      addInvestment: (investment) => set((state) => ({ 
        investments: [...state.investments, investment] 
      })),
      updateInvestment: (investment) => set((state) => ({
        investments: state.investments.map((inv) =>
          inv.id === investment.id ? investment : inv
        ),
      })),
      deleteInvestment: (id) => set((state) => ({
        investments: state.investments.filter((inv) => inv.id !== id),
      })),
      
      addGoal: (goal) => set((state) => ({ 
        goals: [...state.goals, goal] 
      })),
      updateGoal: (goal) => set((state) => ({
        goals: state.goals.map((g) =>
          g.id === goal.id ? goal : g
        ),
      })),
      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter((goal) => goal.id !== id),
      })),
      
      setShowTimeWindowPicker: (showTimeWindowPicker) => set({ showTimeWindowPicker }),
      
      loadSampleData: () => set(sampleData),
      resetState: () => set(initialState),
    }),
    {
      name: 'financial-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => {
        const { ...persistedState } = state;
        return persistedState;
      },
    }
  )
);

export const useAuth = () => {
  const auth = useAuthStore();
  return {
    googleId: auth.googleId,
    authLoading: auth.authLoading,
    setGoogleId: auth.setGoogleId,
    signOut: auth.signOut,
  };
};

export const initializeApp = () => {
  useAuthStore.getState().initializeAuth();
};
