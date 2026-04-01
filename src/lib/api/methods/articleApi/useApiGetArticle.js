import { useQuery } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';


const BASE_QUERY_KEY = 'useApiGetArticle';

export const useApiGetArticle = ({
  id,
  slug,
  gcTime,
  staleTime,
}) => {
  const axios = useAxios();

  const url = id ? `/v1/articles/get_article_by_id/${ id }` : `/v1/articles/get_article_by_slug/${ slug }`;
  const queryFn = () => axios
    .get(url)
    .then(res => res.data)
    .catch((err) => {
      throw { ...err, errorPayload: {
        source: 'useApiGetArticle',
        message: 'Failed to get an article',
        message_json: err,
      }};
    });

  return useQuery({ 
    queryKey: [ BASE_QUERY_KEY, (id || slug) ],
    queryFn,
    enabled: !!id || !!slug,
    refetchOnWindowFocus: false,
    staleTime: staleTime || 172800000, // 48 hours by default
    gcTime: gcTime || Infinity, // infinity by default
  });
};
