import { useQuery } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';


const BASE_QUERY_KEY = 'useApiGetAdminToolIntegrityReport';

export const useApiGetAdminToolIntegrityReport = (config) => {
  const axios = useAxios();
  const { enabled = false } = config || {};

  const queryFn = () => axios
    .get('/v1/auth/habitica/admin/tool-integrity-report')
    .then(res => res?.data || null)
    .catch((err) => {
      throw { ...err, errorPayload: {
        source: 'useApiGetAdminToolIntegrityReport',
        message: 'Failed to load admin Habitica tool integrity report',
        message_json: err,
      }};
    });

  return useQuery({
    queryKey: [ BASE_QUERY_KEY ],
    queryFn,
    enabled,
    refetchOnWindowFocus: false,
  });
};