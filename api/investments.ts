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
  ResultSet: {
    Query: string;
    Result: StockResult[];
  };
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

};