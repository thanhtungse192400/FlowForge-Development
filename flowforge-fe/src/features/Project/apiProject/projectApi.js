import api from '../../../api/axios';

const projectApi = {
  getMyProjects: async () => {
    const response = await api.get('/api/projects/my-projects');
    return response;
  },

  createProject: async (projectData) => {
    // projectData is { name, description }
    const response = await api.post('/api/projects', projectData);
    return response;
  },

  updateProject: async (projectId, projectData) => {
    const response = await api.put(`/api/projects/${projectId}`, projectData);
    return response;
  },

  deleteProject: async (projectId) => {
    const response = await api.delete(`/api/projects/${projectId}`);
    return response;
  }
};

export default projectApi;
