import { useQuery } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';


export const useApiVerifyEmailConfirmation = ({ type, token }) => {
  const axios = useAxios();
  
  const queryFn = () => {
    return axios
      .get(`/v1/email_confirmations/verify/${ type }/${ token }`)
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useApiVerifyEmailConfirmation',
          message: 'Failed to verify an email confirmation',
          message_json: err,
        }};
      });
  };

  return useQuery({
    queryKey: [ 'useApiVerifyEmailConfirmation', type, token ],
    queryFn,
    enabled: !!(type && token),
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });
};
