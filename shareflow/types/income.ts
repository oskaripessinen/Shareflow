import { Income, IncomeCategory } from "context/AppContext";

export interface CreateIncomeRequest {
    group_id: number;
    amount: number;
    title: string;
    description?: string;
    category?: string;
    expense_date?: Date;
    userId: string;
}

export interface IncomeResponse {
  success: boolean;
  message?: string;
  data: Income[];
}

export interface CreateIncomeResponse {
    success: boolean;
    message?: string;
    data: Income;
}

export interface CreateIncomeProps {
    group_id: number;
    title: string;
    amount: number;
    category?: IncomeCategory;
    description?: string;
    income_date: Date;
}
