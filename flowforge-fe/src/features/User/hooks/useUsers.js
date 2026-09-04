import { useQuery } from '@tanstack/react-query';
import userApi from '../apiUser/userApi';

export function useUserSearch(keyword) {
  return useQuery({
    queryKey: ['users', 'search', keyword],
    queryFn: async () => {
      const response = await userApi.searchUsers(keyword);
      return response.data || [];
    },
    enabled: typeof keyword === 'string' && keyword.trim().length > 0
  });
}
