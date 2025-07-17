import { apiClient } from "./client";

export interface RecommendedSymbol {
  score: number;
  symbol: string;
}

export interface StockResult {
  recommendedSymbols: RecommendedSymbol[];
  symbol: string;
}

export interface StockSearchResponse {
  finance: {
    error: string | null;
    result: StockResult[];
  };
}

export const investmentsApi = {
  searchStock: async (searchWord: string): Promise<StockSearchResponse> => {
    try {
      const response = await apiClient.get<StockSearchResponse>(`/investments/search?q=${encodeURIComponent(searchWord)}`);

      return response;
      
    } catch (error) {
      console.error('Error searching stocks:', error);
      throw error;
    }
  },

};