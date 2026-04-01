import { useQuery } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';


const BASE_QUERY_KEY = 'useApiListArticles';

export const useApiListArticles = ({ type, showDeleted }) => {
  const axios = useAxios();

  const queryFn = () => axios
    .get(`/v1/auth/articles/list_articles/${ type || '' }${ showDeleted ? '?show_deleted=true' : '' }`)
    .then(res => res.data)
    .catch((err) => {
      throw { ...err, errorPayload: {
        source: 'useApiListArticles',
        message: 'Failed to get a list of articles',
        message_json: err,
      }};
    });

  return useQuery({ 
    queryKey: [ BASE_QUERY_KEY, type, showDeleted ],
    queryFn,
    enabled: true,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 60000, // 1 minute
    gcTime: 86400000, // 24 hours
  });
};
