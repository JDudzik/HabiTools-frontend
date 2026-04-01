import { useQuery } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';


export const useApiGetCheckoutSessionStatus = (payload) => {
  const axios = useAxios();

  const queryFn = () => axios
    .get('/v1/auth/commerce/get-checkout-session-status', {
      params: {
        session_id: payload.sessionId,
      },
    })
    .then(res => res.data)
    .catch((err) => {
      throw { ...err, errorPayload: {
        source: 'useApiGetCheckoutSessionStatus',
        message: 'Failed to get checkout session status',
        message_json: err,
      }};
    });

  return useQuery({
    queryKey: [ 'useApiGetCheckoutSessionStatus', payload.sessionId ],
    queryFn,
    enabled: !!payload.sessionId,
    refetchOnWindowFocus: false,
    gcTime: 0,
    staleTime: 0,
  });
};
