import { useQuery } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';


export const useApiExample = (payload) => {
  const axios = useAxios();

  const queryFn = () => axios
    .get('/v1/users/email_available', {
      params: {
        email: payload.email,
      },
    })
    .then(res => res.data)
    .catch((err) => {
      throw { ...err, errorPayload: {
        source: 'useApiExample',
        message: 'Failed to ____',
        message_json: err,
      }};
    });

  return useQuery({
    queryKey: [ 'useApiExample', payload.email ],
    queryFn,
    enabled: !!payload.email,
    refetchOnWindowFocus: false,
  });
};
