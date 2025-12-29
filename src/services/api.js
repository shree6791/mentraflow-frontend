// Centralized API Service Layer for FastAPI Backend Integration
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
// Ensure backend URL doesn't have trailing slash
const cleanBackendUrl = BACKEND_URL.replace(/\/$/, '');
const API_BASE = `${cleanBackendUrl}/api/v1`;

// Log API configuration in development (only once, not on every import)
if (process.env.NODE_ENV === 'development' && !window.__API_CONFIG_LOGGED__) {
  console.log('Backend URL:', cleanBackendUrl);
  console.log('API Base:', API_BASE);
  window.__API_CONFIG_LOGGED__ = true;
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle common errors
apiClient.interceptors.response.use(
  (response) => {
    // Log response for debugging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', response.data);
    }
    return response;
  },
  (error) => {
    // More detailed error logging
    if (error.response) {
      // Server responded with error status
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url,
      });
    } else if (error.request) {
      // Request made but no response received
      console.error('API Error: No response received', {
        url: error.config?.url,
        message: error.message,
      });
      console.error('This might be a CORS issue or network problem');
    } else {
      // Error setting up request
      console.error('API Error:', error.message);
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH SERVICE
// ============================================
export const authService = {
  signup: async (data) => {
    const response = await apiClient.post('/auth/signup', data);
    // Handle response that might be wrapped in 'result' object
    const responseData = response.data.result || response.data;
    if (responseData.access_token) {
      localStorage.setItem('access_token', responseData.access_token);
      localStorage.setItem('user', JSON.stringify(responseData));
    }
    return responseData;
  },

  login: async (data) => {
    const response = await apiClient.post('/auth/login', data);
    // Handle response that might be wrapped in 'result' object
    const responseData = response.data.result || response.data;
    if (responseData.access_token) {
      localStorage.setItem('access_token', responseData.access_token);
      localStorage.setItem('user', JSON.stringify(responseData));
    }
    return responseData;
  },

  googleSignIn: async (data) => {
    const response = await apiClient.post('/auth/google', data);
    // Handle response that might be wrapped in 'result' object
    const responseData = response.data.result || response.data;
    if (responseData.access_token) {
      localStorage.setItem('access_token', responseData.access_token);
      localStorage.setItem('user', JSON.stringify(responseData));
    }
    return responseData;
  },

  logout: async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    return { message: 'Logged out successfully' };
  },

  getCurrentUser: async (userId) => {
    const response = await apiClient.get(`/auth/me?user_id=${userId}`);
    // Handle response that might be wrapped in 'result' object
    return response.data.result || response.data;
  },
};

// ============================================
// WORKSPACE SERVICE
// ============================================
export const workspaceService = {
  create: async (ownerUsername, data) => {
    const response = await apiClient.post(`/workspaces?owner_username=${ownerUsername}`, data);
    return response.data;
  },

  list: async (ownerId = null) => {
    const url = ownerId ? `/workspaces?owner_id=${ownerId}` : '/workspaces';
    const response = await apiClient.get(url);
    return response.data;
  },

  get: async (workspaceId) => {
    const response = await apiClient.get(`/workspaces/${workspaceId}`);
    return response.data;
  },

  update: async (workspaceId, data) => {
    const response = await apiClient.patch(`/workspaces/${workspaceId}`, data);
    return response.data;
  },

  delete: async (workspaceId) => {
    await apiClient.delete(`/workspaces/${workspaceId}`);
    return { success: true };
  },
};

// ============================================
// DOCUMENT SERVICE
// ============================================
export const documentService = {
  create: async (data) => {
    const response = await apiClient.post('/documents', data);
    return response.data;
  },

  list: async (workspaceId) => {
    const response = await apiClient.get(`/workspaces/${workspaceId}/documents`);
    return response.data;
  },

  get: async (documentId) => {
    const response = await apiClient.get(`/documents/${documentId}`);
    return response.data;
  },

  update: async (documentId, data) => {
    const response = await apiClient.patch(`/documents/${documentId}`, data);
    return response.data;
  },

  delete: async (documentId) => {
    await apiClient.delete(`/documents/${documentId}`);
    return { success: true };
  },

  ingest: async (documentId, data) => {
    const response = await apiClient.post(`/documents/${documentId}/ingest`, data);
    return response.data;
  },

  getSummary: async (documentId) => {
    const response = await apiClient.get(`/documents/${documentId}/summary`);
    return response.data;
  },

  regenerateSummary: async (documentId, maxBullets = 7) => {
    const response = await apiClient.post(`/documents/${documentId}/summary?max_bullets=${maxBullets}`);
    return response.data;
  },

  generateFlashcards: async (documentId, data) => {
    const response = await apiClient.post(`/documents/${documentId}/flashcards`, data);
    return response.data;
  },

  extractKG: async (documentId, data) => {
    const response = await apiClient.post(`/documents/${documentId}/kg`, data);
    return response.data;
  },
};

// ============================================
// FLASHCARD SERVICE
// ============================================
export const flashcardService = {
  list: async (workspaceId, filters = {}) => {
    const params = new URLSearchParams({ workspace_id: workspaceId });
    if (filters.document_id) params.append('document_id', filters.document_id);
    if (filters.user_id) params.append('user_id', filters.user_id);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);
    
    const response = await apiClient.get(`/flashcards?${params}`);
    return response.data;
  },

  get: async (flashcardId) => {
    const response = await apiClient.get(`/flashcards/${flashcardId}`);
    return response.data;
  },

  getDue: async (workspaceId, userId, limit = 20) => {
    const response = await apiClient.get(`/flashcards/due?workspace_id=${workspaceId}&user_id=${userId}&limit=${limit}`);
    return response.data;
  },

  review: async (flashcardId, data, force = false) => {
    const response = await apiClient.post(`/flashcards/${flashcardId}/review?force=${force}`, data);
    return response.data;
  },
};

// ============================================
// KNOWLEDGE GRAPH SERVICE
// ============================================
export const kgService = {
  listConcepts: async (workspaceId, filters = {}) => {
    const params = new URLSearchParams({ workspace_id: workspaceId });
    if (filters.document_id) params.append('document_id', filters.document_id);
    if (filters.q) params.append('q', filters.q);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);
    
    const response = await apiClient.get(`/kg/concepts?${params}`);
    return response.data;
  },

  getConcept: async (conceptId) => {
    const response = await apiClient.get(`/kg/concepts/${conceptId}`);
    return response.data;
  },

  getNeighbors: async (conceptId, depth = 1) => {
    const response = await apiClient.get(`/kg/concepts/${conceptId}/neighbors?depth=${depth}`);
    return response.data;
  },

  listEdges: async (workspaceId, filters = {}) => {
    const params = new URLSearchParams({ workspace_id: workspaceId });
    if (filters.concept_id) params.append('concept_id', filters.concept_id);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);
    
    const response = await apiClient.get(`/kg/edges?${params}`);
    return response.data;
  },
};

// ============================================
// CHAT SERVICE
// ============================================
export const chatService = {
  sendMessage: async (data) => {
    const response = await apiClient.post('/chat', data);
    return response.data;
  },
};

// ============================================
// SEARCH SERVICE
// ============================================
export const searchService = {
  semanticSearch: async (data) => {
    const response = await apiClient.post('/search', data);
    return response.data;
  },
};

// ============================================
// NOTES SERVICE
// ============================================
export const notesService = {
  create: async (userId, data) => {
    const response = await apiClient.post(`/notes?user_id=${userId}`, data);
    return response.data;
  },

  list: async (workspaceId, filters = {}) => {
    const params = new URLSearchParams({ workspace_id: workspaceId });
    if (filters.document_id) params.append('document_id', filters.document_id);
    if (filters.user_id) params.append('user_id', filters.user_id);
    
    const response = await apiClient.get(`/notes?${params}`);
    return response.data;
  },

  get: async (noteId) => {
    const response = await apiClient.get(`/notes/${noteId}`);
    return response.data;
  },

  update: async (noteId, data) => {
    const response = await apiClient.patch(`/notes/${noteId}`, data);
    return response.data;
  },

  delete: async (noteId) => {
    await apiClient.delete(`/notes/${noteId}`);
    return { success: true };
  },
};

// ============================================
// PREFERENCES SERVICE
// ============================================
export const preferencesService = {
  get: async (userId, workspaceId = null) => {
    const url = workspaceId 
      ? `/preferences?user_id=${userId}&workspace_id=${workspaceId}`
      : `/preferences?user_id=${userId}`;
    const response = await apiClient.get(url);
    return response.data;
  },

  update: async (userId, data, workspaceId = null) => {
    const url = workspaceId 
      ? `/preferences?user_id=${userId}&workspace_id=${workspaceId}`
      : `/preferences?user_id=${userId}`;
    const response = await apiClient.patch(url, data);
    return response.data;
  },
};

// ============================================
// AGENT RUNS SERVICE
// ============================================
export const agentRunsService = {
  get: async (runId) => {
    const response = await apiClient.get(`/agent-runs/${runId}`);
    return response.data;
  },

  list: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.workspace_id) params.append('workspace_id', filters.workspace_id);
    if (filters.user_id) params.append('user_id', filters.user_id);
    if (filters.agent_name) params.append('agent_name', filters.agent_name);
    if (filters.status) params.append('status', filters.status);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);
    
    const response = await apiClient.get(`/agent-runs?${params}`);
    return response.data;
  },
};

// ============================================
// HEALTH CHECK
// ============================================
export const healthService = {
  check: async () => {
    const response = await axios.get(`${BACKEND_URL}/health`);
    return response.data;
  },
};

export default apiClient;

