import { useQuery } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';


const BASE_QUERY_KEY = 'useApiGetHabiticaPartyInfo';

export const useApiGetHabiticaPartyInfo = (config) => {
  const axios = useAxios();
  const { enabled = true } = config || {};

  const queryFn = () => axios
    .get('/v1/auth/habitica/party')
    .then(res => res?.data || null)
    .catch((err) => {
      throw { ...err, errorPayload: {
        source: 'useApiGetHabiticaPartyInfo',
        message: 'Failed to get Habitica party info',
        message_json: err,
      }};
    });

  return useQuery({
    queryKey: [ BASE_QUERY_KEY ],
    queryFn,
    enabled,
  });
};
