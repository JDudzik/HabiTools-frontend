import { useQueryClient } from '@tanstack/react-query';
import { logoutQueriesToInvalidate } from 'lib/data/logoutQueriesToInvalidate';


export const useInvalidateLogoutQueries = () => {
  const queryClient = useQueryClient();

  return () => {
    logoutQueriesToInvalidate.forEach(([ queryKey, mode ]) => {
      if (mode === 'invalidate') {
        queryClient.invalidateQueries(queryKey);
      }

      if (mode === 'reset') {
        queryClient.resetQueries(queryKey);
      }

      if (mode === 'remove') {
        queryClient.removeQueries(queryKey);
      }
    });
  };
};