import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || '';
axios.defaults.baseURL = baseURL;

const getAuthHeader = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleRequest = async <T>(config: any): Promise<T> => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...(config.requiresAuth ? getAuthHeader() : {}),
      ...config.headers,
    };

    const response = await axios({ ...config, headers });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Request failed');
  }
};

export const fetchWrapper = {
  get: <T>(url: string, requiresAuth = false) => 
    handleRequest<T>({ method: 'GET', url, requiresAuth }),

  post: <T>(url: string, data?: any, requiresAuth = false) => 
    handleRequest<T>({ method: 'POST', url, data, requiresAuth }),

  put: <T>(url: string, data?: any, requiresAuth = false) => 
    handleRequest<T>({ method: 'PUT', url, data, requiresAuth }),

  delete: <T>(url: string, requiresAuth = false) => 
    handleRequest<T>({ method: 'DELETE', url, requiresAuth })
};
