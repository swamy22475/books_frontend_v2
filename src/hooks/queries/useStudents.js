/**
 * React Query hooks for Students module.
 *
 * Example usage:
 *
 *   import { useStudents, useStudent } from '@/hooks/queries/useStudents';
 *
 *   function StudentList() {
 *     const { data, isLoading, error } = useStudents({ class_id: 5 });
 *     if (isLoading) return <Spinner />;
 *     if (error) return <ErrorMessage error={error} />;
 *     return <Table data={data} />;
 *   }
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api-client';
import { queryKeys } from '../../lib/query-keys';

// ── Types (match your backend schemas) ──
































// ── Query Hooks ──

/**
 * Fetch paginated/filtered student list.
 */
export const useStudents = (filters) => {
  return useQuery({
    queryKey: queryKeys.students.list(filters),
    queryFn: () => api.get('/students', { params: filters }),
    enabled: !!localStorage.getItem('auth_token')
  });
};

/**
 * Fetch a single student by ID.
 */
export const useStudent = (id) => {
  return useQuery({
    queryKey: queryKeys.students.detail(id),
    queryFn: () => api.get(`/students/${id}`),
    enabled: !!id && !!localStorage.getItem('auth_token')
  });
};

// ── Mutation Hooks ──

/**
 * Create a new student.
 * Automatically invalidates the student list cache on success.
 */
export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.post('/students', data),
    onSuccess: () => {
      // Invalidate all student list queries so they refetch with new data
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all });
    }
  });
};

/**
 * Update an existing student.
 */
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
    api.patch(`/students/${id}`, data),
    onSuccess: (_data, variables) => {
      // Invalidate both the list and the specific student detail
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.students.detail(variables.id) });
    }
  });
};

/**
 * Delete a student.
 */
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => api.delete(`/students/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all });
    }
  });
};