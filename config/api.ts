
export const API_BASE_URL = 'https://apismash.braidx.tech/api';

export interface ApiError {
  code: string;
  message: string;
  details?: { field: string; message: string }[];
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        const errorData = data as { success: boolean; error: ApiError };
        throw errorData.error || { message: `Error ${response.status}: ${response.statusText}` };
      }

      return data;
    } catch (error) {
      // Suppress console error for smoother fallback experience
      throw error;
    }
  }

  get<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        searchParams.append(key, String(params[key]));
      }
    });
    
    const queryString = searchParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Types based on API Spec
export interface Category {
  id: number;
  name: string;
  sortOrder: number;
  isVisible: boolean;
}

export interface Membership {
  id: number;
  name: string;
  type: string;
  price: number;
  sessionCount: number;
  isVisible: boolean;
}

export interface Location {
  id: number;
  name: string;
  description: string;
}

export interface Session {
  id: number;
  datetime: string;
  location: { id: number; name: string };
  category: { id: number; name: string };
  trainers: string;
  name: string;
  maxSpots: number;
  availableSpots: number;
  status: string;
}

export interface BookingRequest {
  name: string;
  phone: string;
  sessionId?: number;
  membershipId?: number;
  message?: string;
  source?: 'session_booking' | 'membership_purchase' | 'contact_form';
}
