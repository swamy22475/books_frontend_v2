import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


/**
 * Global QueryClient configuration.
 *
 * These defaults apply to ALL queries and mutations unless overridden
 * at the individual hook level.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't refetch when window regains focus (ERP is usually one-tab)
      refetchOnWindowFocus: false,
      // Retry failed requests once before showing error
      retry: 1,
      // Cache data for 5 minutes before considering it stale
      staleTime: 5 * 60 * 1000,
      // Keep unused cache data for 10 minutes
      gcTime: 10 * 60 * 1000
    },
    mutations: {
      retry: 0 // Don't auto-retry mutations (create/update/delete)
    }
  }
});

/**
 * App-level provider that wraps the entire application.
 *
 * Usage in App.tsx:
 *   <QueryProvider>
 *     <RouterProvider router={router} />
 *   </QueryProvider>
 */
export const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
            {children}
            {/* DevTools appear as a floating panel in development only */}
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        </QueryClientProvider>);

};