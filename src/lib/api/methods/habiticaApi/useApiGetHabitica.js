import { useQuery } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';


const BASE_QUERY_KEY = 'useApiGetHabitica';

export const useApiGetHabitica = (config) => {
  const { enabled = true } = config || {};
  const axios = useAxios();

  const queryFn = () => axios
    .get('/v1/auth/habitica')
    .then(res => (res.data?.habiticaUser || null))
    .catch((err) => {
      if (err?.response?.status === 404 && err?.response?.data?.status === 'NOT_LINKED') {
        return undefined;
      }

      throw { ...err, errorPayload: {
        source: 'useApiGetHabitica',
        message: 'Failed to get Habitica link status',
        message_json: err,
      }};
    });

  return useQuery({
    queryKey: [ BASE_QUERY_KEY ],
    queryFn,
    enabled,
  });
};
