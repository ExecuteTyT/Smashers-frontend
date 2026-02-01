
// Поддержка переменных окружения для Vite (префикс VITE_)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://apismash.braidx.tech/api';

// Логирование для отладки (только в development)
if (import.meta.env.DEV) {
  console.log('[API] API_BASE_URL:', API_BASE_URL);
  console.log('[API] VITE_API_URL from env:', import.meta.env.VITE_API_URL);
}

export interface ApiError {
  code: string;
  message: string;
  details?: { field: string; message: string }[];
}

// Типы для структурированных ответов API
export interface ApiResponse<T> {
  success: true;
  data: T;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
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

    // Логирование для отладки (только в development)
    if (import.meta.env.DEV) {
      console.log('[API] Request:', url, options);
    }

    try {
      let response: Response;
      try {
        response = await fetch(url, config);
      } catch (fetchError) {
        // Ошибка сети на уровне fetch (CORS, proxy, DNS и т.д.)
        throw { 
          code: 'NETWORK_ERROR', 
          message: fetchError instanceof Error ? fetchError.message : 'Network error: Unable to connect to server' 
        };
      }
      
      // Проверка на HTTP ошибки
      if (!response.ok) {
        // Попытка получить JSON с ошибкой, но не падаем если не получится
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          // Если не удалось распарсить JSON, создаем базовую ошибку
          throw { 
            code: 'HTTP_ERROR', 
            message: `Error ${response.status}: ${response.statusText}` 
          };
        }
        
        const apiError = errorData as ApiErrorResponse | { error?: ApiError };
        throw apiError.error || { 
          code: 'HTTP_ERROR', 
          message: `Error ${response.status}: ${response.statusText}` 
        };
      }

      const data = await response.json();

      // Логирование для отладки (только в development)
      if (import.meta.env.DEV) {
        console.log('[API] Response:', { status: response.status, data });
      }

      // Проверка поля success (даже при статусе 200)
      if (data.success === false) {
        const errorData = data as ApiErrorResponse;
        throw errorData.error;
      }

      // Возвращаем весь объект ответа (включая success и data)
      return data as T;
    } catch (error) {
      // Логирование ошибок только для реальных ошибок API, не для сетевых
      // Сетевые ошибки уже обрабатываются в компонентах через .catch()
      if (import.meta.env.DEV && error && typeof error === 'object' && 'code' in error) {
        const apiError = error as ApiError;
        // Логируем только если это не обычная сетевая ошибка
        if (apiError.code !== 'NETWORK_ERROR') {
          console.error('[API] Error:', error);
        }
      }
      
      // Если это уже наш ApiError, пробрасываем дальше
      if (error && typeof error === 'object' && 'code' in error) {
        throw error;
      }
      // Для других ошибок (сеть, парсинг JSON и т.д.)
      throw { 
        code: 'NETWORK_ERROR', 
        message: error instanceof Error ? error.message : 'Network error' 
      };
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
  showLocation: boolean;
  showOnBookingScreen: boolean;
  sortOrder: number;
  lastUpdated?: string;
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
  price: number | null; // Цена занятия в рублях (может быть null)
  status: string;
  lastUpdated?: string;
}

export interface BookingRequest {
  name: string;
  phone: string;
  sessionId?: number;
  membershipId?: number;
  message?: string;
  source?: 'session_booking' | 'membership_purchase' | 'contact_form';
}
