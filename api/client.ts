import { supabase } from '../utils/supabase';

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL || 'http://localhost:5000';
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      console.log('Getting auth headers...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error:', error);
        return {};
      }
      
      if (session?.access_token) {
        console.log('Token found, length:', session.access_token.length);
        console.log('Token preview:', session.access_token.substring(0, 20) + '...');
        
        return {
          'Authorization': `Bearer ${session.access_token}`,
        };
      }
      
      console.warn('No session or access token found');
      return {};
    } catch (error) {
      console.warn('Failed to get auth token:', error);
      return {};
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const authHeaders = await this.getAuthHeaders();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`Making ${config.method || 'GET'} request to:`, url);
      console.log('Request headers:', config.headers);
      
      if (options.body) {
        console.log('Request body:', options.body);
      }
      
      const response = await fetch(url, config);
      
      console.log(`Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP ${response.status} error:`, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: T = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();