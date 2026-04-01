import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';
import { isArray } from 'property-validator';


export const useMutateAcknowledgeEventMessages = (mutateOptions) => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const mutationFn = (payload) => {
    const sanitizedPayload = sanitizeProperties(payload, {
      optionalKeys: [ 'message_ids' ],
      trimPayload: true,
      removeDisallowedKeys: true,
      propertyValidations: [
        isArray('message_ids'),
      ],
    });

    return axios
      .put('/v1/auth/event-messages/acknowledge', sanitizedPayload.properties)
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateAcknowledgeEventMessages',
          message: 'Failed to acknowledge event message',
          message_json: err,
        }};
      });
  };

  const onSuccess = () => {
    queryClient.resetQueries({ queryKey: [ 'useApiListEventMessages', mutateOptions?.instance ]});
  };

  return useMutation({ mutationFn, onSuccess, ...mutateOptions });
};
