import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyticsApi = {
  getStats: async () => {
    const response = await api.get('/system/stats');
    return response.data;
  },
  
  uploadDataset: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/datasets/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getInsights: async (datasetId: number) => {
    const response = await api.get(`/datasets/${datasetId}/insights`);
    return response.data;
  },
  
  chatWithData: async (query: string, datasetId: number, model: string = 'normal') => {
    const response = await api.post('/chat', { query, dataset_id: datasetId, model });
    return response.data;
  },

  getChatSessions: async () => {
    const response = await api.get('/chat/sessions');
    return response.data;
  },

  createChatSession: async (id: string, title: string, projectId?: number) => {
    const response = await api.post('/chat/sessions', { id, title, project_id: projectId });
    return response.data;
  },

  updateChatSession: async (sessionId: string, title: string) => {
    const response = await api.patch(`/chat/sessions/${sessionId}`, { title });
    return response.data;
  },

  getChatMessages: async (sessionId: string) => {
    const response = await api.get(`/chat/sessions/${sessionId}/messages`);
    return response.data;
  },

  saveChatMessage: async (sessionId: string, role: string, content: string) => {
    const response = await api.post('/chat/messages', { session_id: sessionId, role, content });
    return response.data;
  },

  deleteChatSession: async (sessionId: string) => {
    const response = await api.delete(`/chat/sessions/${sessionId}`);
    return response.data;
  },

  getProjects: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  createProject: async (title: string) => {
    const response = await api.post('/projects', { title });
    return response.data;
  },

  updateProject: async (projectId: number, title: string) => {
    const response = await api.patch(`/projects/${projectId}`, { title });
    return response.data;
  },

  deleteProject: async (projectId: number) => {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  }
};

export default api;
