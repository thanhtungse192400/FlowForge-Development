import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import projectMemberApi from '../apiProject/projectMemberApi';

export function useProjectMembers(projectId) {
  const queryClient = useQueryClient();

  const membersQuery = useQuery({
    queryKey: ['projectMembers', projectId],
    queryFn: async () => {
      const response = await projectMemberApi.getMembers(projectId);
      return response.data || [];
    },
    enabled: !!projectId
  });

  const addMemberMutation = useMutation({
    mutationFn: ({ userId, role }) => projectMemberApi.addMember(projectId, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectMembers', projectId] });
    }
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => projectMemberApi.updateRole(projectId, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectMembers', projectId] });
    }
  });

  const removeMemberMutation = useMutation({
    mutationFn: (userId) => projectMemberApi.removeMember(projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectMembers', projectId] });
    }
  });

  return {
    members: membersQuery.data || [],
    isLoading: membersQuery.isLoading,
    error: membersQuery.error,
    addMember: addMemberMutation.mutateAsync,
    isAdding: addMemberMutation.isPending,
    updateRole: updateRoleMutation.mutateAsync,
    isUpdatingRole: updateRoleMutation.isPending,
    removeMember: removeMemberMutation.mutateAsync,
    isRemoving: removeMemberMutation.isPending
  };
}
