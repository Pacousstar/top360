import axios from 'axios';
import { API_URL } from '../contexts/AuthContext';

const api = axios.create({
  baseURL: API_URL,
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('top360_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('top360_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Restaurants
export const restaurantAPI = {
  list: (params) => api.get('/restaurants', { params }),
  getBySlug: (slug) => api.get(`/restaurants/${slug}`),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  toggleOpen: (id) => api.patch(`/restaurants/${id}/toggle-open`),
};

// Menus
export const menuAPI = {
  getMenu: (restaurantId) => api.get(`/menus/${restaurantId}`),
  createCategory: (data) => api.post('/menus/category', data),
  updateCategory: (id, data) => api.put(`/menus/category/${id}`, data),
  deleteCategory: (id) => api.delete(`/menus/category/${id}`),
  createItem: (data) => api.post('/menus/item', data),
  updateItem: (id, data) => api.put(`/menus/item/${id}`, data),
  toggleItem: (id) => api.patch(`/menus/item/${id}/toggle`),
  deleteItem: (id) => api.delete(`/menus/item/${id}`),
};

// Commandes
export const orderAPI = {
  list: (params) => api.get('/orders', { params }),
  create: (data) => api.post('/orders', data),
  get: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// Admin
export const adminAPI = {
  dashboard: () => api.get('/admin/dashboard'),
  restaurants: (params) => api.get('/admin/restaurants', { params }),
  verify: (id) => api.put(`/admin/restaurants/${id}/verify`),
  toggleActive: (id) => api.put(`/admin/restaurants/${id}/toggle-active`),
  subscriptions: () => api.get('/admin/subscriptions'),
  users: (params) => api.get('/admin/users', { params }),
  appointments: (params) => api.get('/admin/appointments', { params }),
};

// Abonnements
export const subscriptionAPI = {
  get: (restaurantId) => api.get(`/subscriptions/${restaurantId}`),
  subscribe: (data) => api.post('/subscriptions', data),
  check: (restaurantId) => api.get(`/subscriptions/check/${restaurantId}`),
};

// Recherche
export const searchAPI = {
  search: (params) => api.get('/search', { params }),
};

// Avis
export const reviewAPI = {
  list: (restaurantId) => api.get(`/reviews/${restaurantId}`),
  create: (data) => api.post('/reviews', data),
};

// Notifications
export const notificationAPI = {
  list: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

// Annonces
export const announcementAPI = {
  list: (restaurantId) => api.get(`/announcements/${restaurantId}`),
  create: (data) => api.post('/announcements', data),
  delete: (id) => api.delete(`/announcements/${id}`),
};

// Upload
export const uploadAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Paiement
export const paymentAPI = {
  initiate: (orderId) => api.post('/payments/initiate', { order_id: orderId }),
  confirm: (orderId, sessionId) => api.post('/payments/confirm', { order_id: orderId, session_id: sessionId }),
  status: (reference) => api.get(`/payments/status/${reference}`),
};

// Réservations & rendez-vous
export const appointmentAPI = {
  create: (data) => api.post('/appointments', data),
  list: (params) => api.get('/appointments', { params }),
  updateStatus: (id, status) => api.put(`/appointments/${id}/status`, { status }),
};

export default api;
