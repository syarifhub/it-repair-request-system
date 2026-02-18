import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://hotel-repair-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Report API interfaces and functions
export interface MonthlyStats {
  byDepartment: { [key: string]: number };
  byStatus: { [key: string]: number };
  byEquipmentType: { [key: string]: number };
  byDepartmentEquipment: { [department: string]: { [equipment: string]: number } };
  totalRequests: number;
  month: number;
  year: number;
}

export interface MonthlyRequest {
  _id: string;
  requestNumber: string;
  department: string;
  equipmentType: string;
  status: string;
  title: string;
  createdAt: string;
  assignedTo?: {
    fullName: string;
    username: string;
  };
  statusHistory?: Array<{
    oldStatus?: string;
    newStatus: string;
    changedBy?: string;
    notes?: string;
    changedAt: string;
  }>;
}

export interface MonthlyRequestsResponse {
  data: MonthlyRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AvailableMonth {
  month: number;
  year: number;
  count: number;
}

export const getMonthlyStats = async (
  month: number,
  year: number
): Promise<MonthlyStats> => {
  const response = await api.get(`/reports/monthly-stats`, {
    params: { month, year },
  });
  return response.data.data;
};

export const getMonthlyRequests = async (
  month: number,
  year: number,
  page: number = 1,
  limit: number = 20,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc'
): Promise<MonthlyRequestsResponse> => {
  const response = await api.get(`/reports/monthly-requests`, {
    params: { month, year, page, limit, sortBy, sortOrder },
  });
  return response.data;
};

export const getAvailableMonths = async (): Promise<AvailableMonth[]> => {
  const response = await api.get(`/reports/available-months`);
  return response.data.data;
};
