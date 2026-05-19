import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';


const HABITICA_QUERY_KEY = [ 'useApiGetHabitica' ];

export const useMutateRefreshTool = (mutateOptions) => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const mutationFn = (payload) => {
    const sanitizedPayload = sanitizeProperties(payload, {
      requiredKeys: [ 'resourceId' ],
      trimPayload: true,
      removeDisallowedKeys: true,
    });
    const sanitizedProperties = sanitizedPayload.properties;

    return axios
      .put('/v1/auth/habitica/tools/refresh', {
        resource_id: sanitizedProperties.resourceId,
      })
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateRefreshTool',
          message: 'Failed to refresh tool',
          message_json: err,
        }};
      });
  };

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: HABITICA_QUERY_KEY });
  };

  return useMutation({ mutationFn, onSuccess, ...mutateOptions });
};
