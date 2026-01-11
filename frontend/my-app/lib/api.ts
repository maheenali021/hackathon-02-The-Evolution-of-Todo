import { Task } from '../types/task';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  async login(userId: string, email?: string): Promise<{access_token: string, token_type: string}> {
    const response = await this.request<{access_token: string, token_type: string}>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, email: email || null }),
    });

    // Store the token in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('user_id', userId);
    }

    return response;
  }

  async signup(userId: string, email: string, name?: string): Promise<{access_token: string, token_type: string}> {
    const response = await this.request<{access_token: string, token_type: string}>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        email: email,
        name: name || userId
      }),
    });

    // Store the token in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('user_id', userId);
    }

    return response;
  }

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      window.location.href = '/auth/login'; // Redirect to login page
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_id');
          window.location.href = '/auth/login';
        }
        throw new Error('Unauthorized: Please log in again');
      }

      if (response.status === 403) {
        throw new Error('Forbidden: You do not have permission to access this resource');
      }

      if (response.status === 404) {
        throw new Error('Resource not found');
      }

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          // If response is not JSON, create a generic error
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const errorMessage = errorData?.detail || errorData?.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      if (response.status === 204) {
        return Promise.resolve(undefined as unknown as T);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Task API methods
  async getTasks(userId: string): Promise<Task[]> {
    return this.request<Task[]>(`/api/${userId}/tasks`);
  }

  async createTask(userId: string, taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    return this.request<Task>(`/api/${userId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async getTask(userId: string, taskId: number): Promise<Task> {
    return this.request<Task>(`/api/${userId}/tasks/${taskId}`);
  }

  async updateTask(userId: string, taskId: number, taskData: Partial<Task>): Promise<Task> {
    return this.request<Task>(`/api/${userId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(userId: string, taskId: number): Promise<void> {
    await this.request<void>(`/api/${userId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  async toggleTaskCompletion(userId: string, taskId: number): Promise<Task> {
    return this.request<Task>(`/api/${userId}/tasks/${taskId}/complete`, {
      method: 'PATCH',
    });
  }
}

export const apiClient = new ApiClient();