import { useQuery } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';

const BASE_QUERY_KEY = 'useApiSingleAnalyticLog';

export const useApiSingleAnalyticLog = (logId) => {
  const axios = useAxios();

  const queryFn = () => axios
    .get(`/v1/auth/analytics/single-log/${ logId }`)
    .then(res => res.data);

  return useQuery({ 
    queryKey: [ BASE_QUERY_KEY, logId ],
    queryFn,
    enabled: !!logId,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
