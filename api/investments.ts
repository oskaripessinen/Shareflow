import { apiClient } from "./client";

export interface RecommendedSymbol {
  score: number;
  symbol: string;
}

export interface StockResult {
  recommendedSymbols: RecommendedSymbol[];
  symbol: string;
  type: string;
  name: string;
}

export interface StockSearchResponse {
  ResultSet: {
    Query: string;
    Result: StockResult[];
  };
}

export interface StockPriceResponse {
  currency: string;
  date: string;
  high: number;
  low: number;
  open: number;
  price: number;
  ticker: string;
  volume: number;
}

export interface Investment {
  id: number;
  group_id: number;
  ticker: string;
  name: string;
  type: string;
  quantity: number;
  purchase_price: number;
  purchase_date: Date;
  paid_by: string;
  created_at: string;
  updated_at: string;
}

export interface AddInvestmentResponse {
  success: boolean;
  message: string;
  data: Investment;
}

export interface InvestmentResponse {
  success: boolean;
  message?: string;
  data: Investment[];
}

export const investmentsApi = {
  searchStock: async (searchWord: string): Promise<StockSearchResponse> => {
    try {
      const response = await apiClient.get(`/api/investments/search?query=${encodeURIComponent(searchWord)}`) as { data: StockSearchResponse };

      return response.data;

    } catch (error) {
      console.error('Error searching stocks:', error);
      throw error;
    }
  },

  getStockPrice: async (ticker: string, date: Date): Promise<StockPriceResponse> => {
    try {
      const dateString = date.toISOString().split('T')[0]; 
      const response = await apiClient.get(`/api/investments/stockPrice?ticker=${encodeURIComponent(ticker)}&date=${dateString}`) as { data: StockPriceResponse };

      return response.data;

    } catch (error) {
      console.error('Error fetching stock price:', error);
      throw error;
    }
  },

  AddInvestment: async (group_id: number, ticker: string, name: string, type: string, quantity: number, purchasePrice: number, purchaseDate: Date, googleId: string): Promise<AddInvestmentResponse> => {
    try {
      const response = await apiClient.post('/api/investments', {
        group_id,
        ticker,
        name,
        type,
        quantity,
        purchase_price: purchasePrice,
        purchase_date: purchaseDate.toISOString().split('T')[0],
        added_by: googleId
      }) as { data: AddInvestmentResponse };

      return response.data;
    } catch (error) {
      console.error('Error adding investment:', error);
      throw error;
    }
  },

  GetInvestmentsByGroupId: async(group_id: number): Promise<Investment[]> => {
    try {
      const response = await apiClient.get<InvestmentResponse>(`/api/investments/${group_id}`);
      return response.data;

    } catch(error) {
        throw error;
    }
  }
};