import api from '../../../api/axios';

const taskApi = {
  getProjectTasks: async (projectId) => {
    const response = await api.get(`/api/v1/tasks/project/${projectId}`);
    return response;
  },

  createTask: async (taskData) => {
    // taskData: { title, description, status, projectId, assignedToId }
    const response = await api.post('/api/v1/tasks', taskData);
    return response;
  },

  updateTask: async (taskId, taskData) => {
    const response = await api.put(`/api/v1/tasks/${taskId}`, taskData);
    return response;
  },

  deleteTask: async (taskId) => {
    const response = await api.delete(`/api/v1/tasks/${taskId}`);
    return response;
  }
};

export default taskApi;
