import { useQuery } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';


const BASE_QUERY_KEY = 'useApiSearchUsers';

export const useApiSearchUsers = (payload) => {
  const axios = useAxios();
  const sanitizedPayload = sanitizeProperties(payload, {
    optionalKeys: [ 'id', 'coach_id', 'first_name', 'last_name', 'email', 'is_paid_user', 'minimal_results', 'allow_deleted' ],
  });

  const queryFn = () => axios
    .get('/v1/auth/users/admin/search_users', {
      params: sanitizedPayload.properties,
    })
    .then(res => res.data)
    .catch((err) => {
      throw { ...err, errorPayload: {
        source: 'useApiSearchUsers',
        message: 'Failed to search for users (from admin)',
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
