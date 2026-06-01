import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';
import { isUUID } from 'property-validator';


const HABITICA_QUERY_KEY = 'useApiGetHabitica';

export const useMutateEditPartyPulse = (mutateOptions) => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const mutationFn = (payload) => {
    const sanitizedPayload = sanitizeProperties(payload, {
      requiredKeys: [ 'resourceId', 'scoreDisplayDirection' ],
      trimPayload: true,
      removeDisallowedKeys: true,
      propertyValidations: [
        isUUID('resourceId', 'resourceId must be a valid UUID'),
      ],
    });
    const sanitizedProperties = sanitizedPayload.properties;
    const scoreDisplayDirection = sanitizedProperties.scoreDisplayDirection === 'ascending'
      ? 'ascending'
      : 'descending';

    return axios
      .put('/v1/auth/habitica/tools/party-pulse/edit', {
        resource_id: sanitizedProperties.resourceId,
        score_display_direction: scoreDisplayDirection,
      })
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateEditPartyPulse',
          message: 'Failed to update party pulse tool',
          message_json: err,
        }};
      });
  };

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: [ HABITICA_QUERY_KEY ]});
    queryClient.invalidateQueries({ queryKey: [ 'useApiListEventMessages', 'party-pulse' ]});
  };

  return useMutation({ mutationFn, onSuccess, ...mutateOptions });
};
