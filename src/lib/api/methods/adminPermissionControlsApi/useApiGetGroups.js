import { useQuery } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';


const BASE_QUERY_KEY = 'useApiGetGroups';

export const useApiGetGroups = (payload) => {
  const axios = useAxios();
  const sanitizedPayload = sanitizeProperties(payload, {
    optionalKeys: [ 'search_text' ],
    trimPayload: true,
    removeDisallowedKeys: true,
  });

  const queryFn = () => axios
    .get('/v1/auth/users/admin/get_groups', {
      params: sanitizedPayload.properties,
    })
    .then(res => res.data)
    .catch((err) => {
      throw { ...err, errorPayload: {
        source: 'useApiGetGroups',
        message: 'Failed to get groups (from admin)',
        message_json: err,
      }};
    });

  return useQuery({
    queryKey: [ BASE_QUERY_KEY, sanitizedPayload.properties ],
    queryFn,
    enabled: true,
    refetchOnWindowFocus: false,
  });
};
