import { useQuery } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';

const BASE_QUERY_KEY = 'useApiListAnalyticLogs';

export const useApiListAnalyticLogs = (options) => {
  const {
    pageNumber = 1,
    hideApi = false,
  } = options;
  const axios = useAxios();

  const queryFn = () => axios
    .get(`/v1/auth/analytics/logs/${ pageNumber }`, {
      params: {
        hide_api: hideApi,
      },
    })
    .then(res => res.data);

  return useQuery({ 
    queryKey: [ BASE_QUERY_KEY, pageNumber, hideApi ],
    queryFn,
    enabled: !!pageNumber,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
