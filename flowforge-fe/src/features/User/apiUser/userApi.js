import api from '../../../api/axios';

const userApi = {
  searchUsers: async (keyword) => {
    const response = await api.get('/api/v1/users/search', {
      params: { keyword }
    });
    return response;
  }
};

export default userApi;
