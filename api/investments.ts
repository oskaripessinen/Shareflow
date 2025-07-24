import { apiClient } from "./client";

export interface RecommendedSymbol {
  score: number;
  symbol: string;
}

export interface StockResult {
  recommendedSymbols: RecommendedSymbol[];
  symbol: string;
  name: string;
}

export interface StockSearchResponse {
  ResultSet: {
    Query: string;
    Result: StockResult[];
  };
}

export interface StockPriceResponse {
  chart: {
    result: [{
      meta: {
        currency: string;
        symbol: string;
        regularMarketPrice: number;
        previousClose: number;
      };
      timestamp: number[];
      indicators: {
        quote: [{
          close: number[];
          high: number[];
          low: number[];
          open: number[];
          volume: number[];
        }];
      };
    }];
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

  getStockPrice: async (ticker: string, date: Date): Promise<StockPriceResponse> => {
    try {
      const dateString = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      const response = await apiClient.get(`/api/investments/stockPrice?ticker=${encodeURIComponent(ticker)}&date=${dateString}`) as { data: StockPriceResponse };

      return response.data;

    } catch (error) {
      console.error('Error fetching stock price:', error);
      throw error;
    }
  }

};