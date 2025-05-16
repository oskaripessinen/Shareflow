import { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
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

interface AppState {
  income: Income;
  expenses: Expense[];
  investments: Investment[];
  goals: Goal[];
  savings: Savings;
}

// Initial state
const initialState: AppState = {
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
};

// Sample data for demonstration
const sampleData: AppState = {
  income: {
    amount: 3200,
    isGross: false,
  },
  expenses: [
    {
      id: '1',
      amount: 850,
      description: 'Rent',
      category: 'housing',
      date: '2025-05-01T12:00:00Z',
    },
    {
      id: '2',
      amount: 350,
      description: 'Groceries',
      category: 'food',
      date: '2025-05-05T14:30:00Z',
    },
    {
      id: '3',
      amount: 120,
      description: 'Phone and Internet',
      category: 'utilities',
      date: '2025-05-10T09:15:00Z',
    },
    {
      id: '4',
      amount: 75,
      description: 'Movie and Dinner',
      category: 'entertainment',
      date: '2025-05-15T18:45:00Z',
    },
    {
      id: '5',
      amount: 200,
      description: 'Monthly Bus Pass',
      category: 'transportation',
      date: '2025-05-02T10:00:00Z',
    },
  ],
  investments: [
    {
      id: '1',
      name: 'Global Index Fund',
      type: 'fund',
      quantity: 10,
      purchasePrice: 100,
      currentPrice: 108,
      purchaseDate: '2025-01-15T12:00:00Z',
    },
    {
      id: '2',
      name: 'Apple Inc.',
      type: 'stock',
      quantity: 50,
      purchasePrice: 150,
      currentPrice: 165,
      purchaseDate: '2025-02-20T12:00:00Z',
    },
    {
      id: '3',
      name: 'Bitcoin',
      type: 'crypto',
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
};

// Action types
type Action =
  | { type: 'SET_INCOME'; payload: Income }
  | { type: 'SET_SAVINGS_TARGET'; payload: number }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'ADD_INVESTMENT'; payload: Investment }
  | { type: 'UPDATE_INVESTMENT'; payload: Investment }
  | { type: 'DELETE_INVESTMENT'; payload: string }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: Goal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'LOAD_STATE'; payload: AppState };

// Reducer
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_INCOME':
      return { ...state, income: action.payload };
    case 'SET_SAVINGS_TARGET':
      return { ...state, savings: { ...state.savings, target: action.payload } };
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map((exp) =>
          exp.id === action.payload.id ? action.payload : exp,
        ),
      };
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter((exp) => exp.id !== action.payload),
      };
    case 'ADD_INVESTMENT':
      return { ...state, investments: [...state.investments, action.payload] };
    case 'UPDATE_INVESTMENT':
      return {
        ...state,
        investments: state.investments.map((inv) =>
          inv.id === action.payload.id ? action.payload : inv,
        ),
      };
    case 'DELETE_INVESTMENT':
      return {
        ...state,
        investments: state.investments.filter((inv) => inv.id !== action.payload),
      };
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map((goal) => (goal.id === action.payload.id ? action.payload : goal)),
      };
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter((goal) => goal.id !== action.payload),
      };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
};

// Context
interface AppContextType extends AppState {
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('financialAppData');
        if (savedData) {
          dispatch({ type: 'LOAD_STATE', payload: JSON.parse(savedData) });
        } else {
          dispatch({ type: 'LOAD_STATE', payload: sampleData });
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        dispatch({ type: 'LOAD_STATE', payload: sampleData });
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('financialAppData', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save data:', error);
      }
    };

    if (state !== initialState) {
      saveData();
    }
  }, [state]);

  // Context
  const value: AppContextType = {
    ...state,
    setIncome: (income) => dispatch({ type: 'SET_INCOME', payload: income }),
    setSavingsTarget: (target) => dispatch({ type: 'SET_SAVINGS_TARGET', payload: target }),
    addExpense: (expense) => dispatch({ type: 'ADD_EXPENSE', payload: expense }),
    updateExpense: (expense) => dispatch({ type: 'UPDATE_EXPENSE', payload: expense }),
    deleteExpense: (id) => dispatch({ type: 'DELETE_EXPENSE', payload: id }),
    addInvestment: (investment) => dispatch({ type: 'ADD_INVESTMENT', payload: investment }),
    updateInvestment: (investment) => dispatch({ type: 'UPDATE_INVESTMENT', payload: investment }),
    deleteInvestment: (id) => dispatch({ type: 'DELETE_INVESTMENT', payload: id }),
    addGoal: (goal) => dispatch({ type: 'ADD_GOAL', payload: goal }),
    updateGoal: (goal) => dispatch({ type: 'UPDATE_GOAL', payload: goal }),
    deleteGoal: (id) => dispatch({ type: 'DELETE_GOAL', payload: id }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
