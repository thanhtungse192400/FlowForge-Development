import api from '../../../api/axios';

const projectMemberApi = {
  getMembers: async (projectId) => {
    const response = await api.get(`/api/projects/${projectId}/members`);
    return response;
  },

  addMember: async (projectId, userId, role) => {
    const response = await api.post(`/api/projects/${projectId}/members/${userId}`, { role });
    return response;
  },

  updateRole: async (projectId, userId, role) => {
    const response = await api.put(`/api/projects/${projectId}/members/${userId}`, { role });
    return response;
  },

  removeMember: async (projectId, userId) => {
    const response = await api.delete(`/api/projects/${projectId}/members/${userId}`);
    return response;
  }
};

export default projectMemberApi;
