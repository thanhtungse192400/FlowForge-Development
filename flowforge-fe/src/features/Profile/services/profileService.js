import api from '../../../api/axios';

const profileService = {
    getProfile: async () => {
        const response = await api.get('/api/v1/profile');
        return response;
    },

    updateProfile: async (name, fullName, phone) => {
        const response = await api.put('/api/v1/profile', { name, fullName, phone });
        return response;
    },
    addImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/api/v1/profile/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    }
};

export default profileService;