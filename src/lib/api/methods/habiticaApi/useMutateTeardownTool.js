import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';


const HABITICA_QUERY_KEY = [ 'useApiGetHabitica' ];

export const useMutateTeardownTool = (mutateOptions) => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const mutationFn = (payload) => {
    const sanitizedPayload = sanitizeProperties(payload, {
      requiredKeys: [ 'resourceId' ],
      optionalKeys: [ 'notification' ],
      trimPayload: true,
      removeDisallowedKeys: true,
    });
    const sanitizedProperties = sanitizedPayload.properties;
    const notification = sanitizedProperties.notification;

    return axios
      .delete('/v1/auth/habitica/tools/teardown', {
        data: {
          resource_id: sanitizedProperties.resourceId,
          notification: notification && {
            slugPrefix: notification.slugPrefix,
            name: notification.name,
            fromExpiration: notification.fromExpiration,
          },
        },
      })
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateTeardownTool',
          message: 'Failed to teardown tool',
          message_json: err,
        }};
      });
  };

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: HABITICA_QUERY_KEY });
  };

  return useMutation({ mutationFn, onSuccess, ...mutateOptions });
};
