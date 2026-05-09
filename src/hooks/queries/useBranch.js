/**
 * React Query hooks for the Branch Admin module.
 *
 * Example usage in a component:
 *
 *   import { useBranchStats, useBranchProfile } from '@/hooks/queries/useBranch';
 *
 *   function BranchDashboard() {
 *     const { data: stats, isLoading } = useBranchStats();
 *     if (isLoading) return <Spinner />;
 *     return <div>Students: {stats.student_count}</div>;
 *   }
 */
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api-client';
import { queryKeys } from '../../lib/query-keys';

// ── Types ──
























// ── Hooks ──

/**
 * Fetch branch dashboard statistics.
 * Only call this for branch_admin / branch_principal users.
 */
export const useBranchStats = (branchId) => {
  return useQuery({
    queryKey: queryKeys.branches.stats(branchId),
    queryFn: () => api.get('/branch/stats'),
    // Only run if user is authenticated (token exists)
    enabled: !!localStorage.getItem('auth_token')
  });
};

/**
 * Fetch branch profile information.
 */
export const useBranchProfile = (branchId) => {
  return useQuery({
    queryKey: queryKeys.branches.profile(branchId),
    queryFn: () => api.get('/branch/profile'),
    enabled: !!localStorage.getItem('auth_token')
  });
};

/**
 * Fetch list of all branches (for school admins).
 */
export const useBranches = () => {
  return useQuery({
    queryKey: queryKeys.branches.list(),
    queryFn: () => api.get('/branches'),
    enabled: !!localStorage.getItem('auth_token')
  });
};

/**
 * Fetch a single branch by ID.
 */
export const useBranch = (id) => {
  return useQuery({
    queryKey: queryKeys.branches.detail(id),
    queryFn: () => api.get(`/branches/${id}`),
    enabled: !!id && !!localStorage.getItem('auth_token')
  });
};