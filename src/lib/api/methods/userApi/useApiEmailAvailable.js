import { useQuery } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';

const BASE_QUERY_KEY = 'useApiEmailAvailable';

export const useApiEmailAvailable = (email) => {
  const axios = useAxios();

  const queryFn = () => axios
    .get(`/v1/users/email_available?email=${ email }`)
    .then(res => res.data)
    .catch((err) => {
      throw { ...err, errorPayload: {
        source: 'useApiEmailAvailable',
        message: 'Failed to check if email is available',
        message_json: err,
      }};
    });

  return useQuery({ 
    queryKey: [ BASE_QUERY_KEY, email ],
    queryFn,
    enabled: !!email,
  });
};
