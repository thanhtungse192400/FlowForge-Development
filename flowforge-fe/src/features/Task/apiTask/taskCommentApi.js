import api from '../../../api/axios';

const taskCommentApi = {
    getTaskComments: async (taskId) => {
        const response = await api.get(`/api/v1/tasks/${taskId}/comments`);
        return response;
    },
    postTaskComment: async (taskId, commentData) => {
        const response = await api.post(`/api/v1/tasks/${taskId}/comments`, commentData);
        return response;
    },

};
export default taskCommentApi;
