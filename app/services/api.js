import axios from 'axios';

const myBaseUrl = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: myBaseUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Django TokenAuthentication
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.reload()
    }
    return Promise.reject(error);
  }
);

export const AuthAPI = {
  register: (formData) => api.post('/register/', formData),
  login: (credentials) => api.post('/login/', credentials),
};

export const PasscodeAPI = {
  list: () => api.get('/passcodes/'), // Get all passcodes
  create: (data) => api.post('/passcodes/', data), // Create new passcode
  verify: (data) => api.post('/verify-passcode/', data), // Verify passcode input
};

export const UserAPI = {
  list: () => api.get('/register/'),
  detail: (id) => api.get(`/user/${id}/`),
  update: (id, data) => api.put(`/user/${id}/`, data),
  delete: (id) => api.delete(`/user/${id}/`),
  block: (id) => api.patch(`/admin/users/${id}/block/`),
  unblock: (id) => api.patch(`/admin/users/${id}/unblock/`),
};

export const PublicationAPI = {
  list: () => api.get('/publications/'),
  create: (data) => api.post('/publications/', data),
  detail: (id) => api.get(`/publications/${id}/`),
  update: (id, data) => api.put(`/publications/${id}/`, data),
  delete: (id) => api.delete(`/publications/${id}/`),
  userPublications: (userId) => api.get(`/users/${userId}/publications/`),
  stats: (params) => api.get('/publications/stats/', { params }),
  editorActivities: () => api.get('/editor-activities/'),
  paginated: (page) => api.get('/publications/', { params: { page } }),
};

export const CategoryAPI = {
  list: () => api.get('/categories/'),
  detail: (id) => api.get(`/categories/${id}/`),
  create: (data) => api.post('/categories/', data),
  update: (id, data) => api.put(`/categories/${id}/`, data),
  delete: (id) => api.delete(`/categories/${id}/`),
};

export const ViewsAPI = {
  create: (publicationId, data) => api.post(`/publications/${publicationId}/views/`, data),
  detail: (publicationId) => api.get(`/publications/${publicationId}/views/me/`),
  update: (publicationId, data) => api.put(`/publications/${publicationId}/views/me/`, data),
};

export const MessageAPI = {
  list: () => api.get('/messages/'), // Fetch all messages
  detail: (id) => api.get(`/messages/${id}/`), // Fetch single message (optional, for detail view if needed)
  create: (data) => api.post('/messages/', data), // Create new message (optional, if needed in frontend)
  update: (id, data) => api.put(`/messages/${id}/`, data), // Update message (optional)
  delete: (id) => api.delete(`/messages/${id}/`), // Delete message (optional)
};



export default api;