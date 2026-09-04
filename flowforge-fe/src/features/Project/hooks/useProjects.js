import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import projectApi from '../apiProject/projectApi';

export function useProjects() {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await projectApi.getMyProjects();
      // Backend returns ApiResponse<List<ProjectMemberResponse>> for my-projects
      // We want to extract the list from response.data (or project member lists)
      return response.data || [];
    }
  });

  const createProjectMutation = useMutation({
    mutationFn: projectApi.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ projectId, data }) => projectApi.updateProject(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  const deleteProjectMutation = useMutation({
    mutationFn: projectApi.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  return {
    projects: projectsQuery.data || [],
    isLoading: projectsQuery.isLoading,
    error: projectsQuery.error,
    refetch: projectsQuery.refetch,
    createProject: createProjectMutation.mutateAsync,
    isCreating: createProjectMutation.isPending,
    updateProject: updateProjectMutation.mutateAsync,
    isUpdating: updateProjectMutation.isPending,
    deleteProject: deleteProjectMutation.mutateAsync,
    isDeleting: deleteProjectMutation.isPending
  };
}
