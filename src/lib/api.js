import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('civic_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle token expiration or unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        localStorage.removeItem('civic_token');
        localStorage.removeItem('civic_user');
      }
    }
    return Promise.reject(error);
  }
);

// -------------------------------------------------------------
// Auth Services
// -------------------------------------------------------------
export const authAPI = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  updateProfile: async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    return res.data;
  },
  changePassword: async (passwordData) => {
    const res = await api.put('/auth/change-password', passwordData);
    return res.data;
  },
};

// -------------------------------------------------------------
// Issue Services
// -------------------------------------------------------------
export const issuesAPI = {
  getAll: async (params = {}) => {
    const res = await api.get('/issues', { params });
    return res.data;
  },
  getMy: async () => {
    const res = await api.get('/issues/my');
    return res.data;
  },
  getAssigned: async () => {
    const res = await api.get('/issues/assigned');
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/issues/${id}`);
    return res.data;
  },
  create: async (formData) => {
    const isMultipart = formData instanceof FormData;
    const res = await api.post('/issues', formData, {
      headers: isMultipart ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return res.data;
  },
  update: async (id, updateData) => {
    const res = await api.put(`/issues/${id}`, updateData);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/issues/${id}`);
    return res.data;
  },
};

// -------------------------------------------------------------
// User Management Services (Admin)
// -------------------------------------------------------------
export const usersAPI = {
  getAll: async (params = {}) => {
    const res = await api.get('/users', { params });
    return res.data;
  },
  getOfficers: async () => {
    const res = await api.get('/users/officers');
    return res.data;
  },
  create: async (userData) => {
    const res = await api.post('/users', userData);
    return res.data;
  },
  update: async (id, userData) => {
    const res = await api.put(`/users/${id}`, userData);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },
};

// -------------------------------------------------------------
// Department Services
// -------------------------------------------------------------
export const departmentsAPI = {
  getAll: async () => {
    const res = await api.get('/departments');
    return res.data;
  },
  create: async (deptData) => {
    const res = await api.post('/departments', deptData);
    return res.data;
  },
  update: async (id, deptData) => {
    const res = await api.put(`/departments/${id}`, deptData);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/departments/${id}`);
    return res.data;
  },
};

// -------------------------------------------------------------
// Analytics / Stats Services
// -------------------------------------------------------------
export const statsAPI = {
  getOverview: async () => {
    const res = await api.get('/stats/overview');
    return res.data;
  },
};

// -------------------------------------------------------------
// Upload Services
// -------------------------------------------------------------
export const uploadAPI = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};

export default api;
