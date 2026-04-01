import { useQuery } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';

const BASE_QUERY_KEY = 'useApiListFeedbackLogs';

export const useApiListFeedbackLogs = (pageNumber) => {
  const axios = useAxios();

  const queryFn = () => axios
    .get(`/v1/auth/feedbacks/${ pageNumber }`)
    .then(res => res.data);

  return useQuery({ 
    queryKey: [ BASE_QUERY_KEY, pageNumber ],
    queryFn,
    enabled: !!pageNumber,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
