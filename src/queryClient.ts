import { QueryClient } from '@tanstack/react-query';

// Create a client with default options
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // Don't refetch when window regains focus
            staleTime: 5 * 60 * 1000, // Data becomes stale after 5 minutes
            retry: 1, // Only retry failed requests once 
            gcTime: 10 * 60 * 1000, // Cache data for 10 minutes
        }
    }
})

export default queryClient;
