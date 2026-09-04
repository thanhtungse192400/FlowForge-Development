import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import taskApi from '../apiTask/taskApi';

export function useTasks(projectId) {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      const response = await taskApi.getProjectTasks(projectId);
      return response.data || [];
    },
    enabled: !!projectId
  });

  const createTaskMutation = useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    }
  });

  const updateTaskMutation = useMutation({
  mutationFn: ({ taskId, data }) => taskApi.updateTask(taskId, data),
  onMutate: async ({ taskId, data }) => {
    await queryClient.cancelQueries(['tasks', projectId]);
    const previousTasks = queryClient.getQueryData(['tasks', projectId]);
    
    // Cập nhật cache ngay lập tức
    queryClient.setQueryData(['tasks', projectId], (old) => {
      return old.map(t => t.taskId === taskId ? { ...t, ...data } : t);
    });
    return { previousTasks };
  },
  onError: (err, variables, context) => {
    queryClient.setQueryData(['tasks', projectId], context.previousTasks);
  },
  onSettled: () => {
    queryClient.invalidateQueries(['tasks', projectId]);
  }
});

  const deleteTaskMutation = useMutation({
    mutationFn: taskApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    }
  });

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error,
    createTask: createTaskMutation.mutateAsync,
    isCreating: createTaskMutation.isPending,
    updateTask: updateTaskMutation.mutateAsync,
    isUpdating: updateTaskMutation.isPending,
    deleteTask: deleteTaskMutation.mutateAsync,
    isDeleting: deleteTaskMutation.isPending
  };
}
