export interface Expense {
  id: number;
  group_id: number;
  amount: number;
  title: string;
  description?: string;
  category?: string;
  paid_by: string;
  expense_date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateExpenseRequest {
  group_id: number;
  amount: number;
  title: string;
  description?: string;
  category?: string;
  expense_date?: Date;
  paid_by: string;
}

export interface UpdateExpenseRequest {
  amount?: number;
  title?: string;
  description?: string;
  category?: string;
  expense_date?: Date;
}

export interface CreateExpenseResponse {
  success: boolean;
  message?: string;
  data: Expense;
}

export interface ExpensesResponse {
  success: boolean;
  message?: string;
  data: Expense[];
}

export interface ExpenseClassification {
  expenseName: string;
  totalPrice: string;
  category: ExpenseCategory | null;
}

export type ExpenseCategory =
  | 'food'
  | 'housing'
  | 'transportation'
  | 'entertainment'
  | 'utilities'
  | 'health'
  | 'clothing'
  | 'other';

export interface ReactNativeFile {
  uri: string;
  type: string;
  name: string;
}
