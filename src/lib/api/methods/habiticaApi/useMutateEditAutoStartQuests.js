import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';
import { isUUID, isInt } from 'property-validator';


const HABITICA_QUERY_KEY = 'useApiGetHabitica';

export const useMutateEditAutoStartQuests = (mutateOptions) => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const mutationFn = (payload) => {
    const sanitizedPayload = sanitizeProperties(payload, {
      requiredKeys: [ 'resourceId', 'waitHours' ],
      trimPayload: true,
      removeDisallowedKeys: true,
      propertyValidations: [
        isUUID('resourceId', 'resourceId must be a valid UUID'),
        isInt('waitHours', { min: 0, max: 24 }, 'waitHours must be an integer between 0 and 24'),
      ],
    });
    const sanitizedProperties = sanitizedPayload.properties;

    return axios
      .put('/v1/auth/habitica/tools/auto-start-quests/edit', {
        resource_id: sanitizedProperties.resourceId,
        wait_hours: Number(sanitizedProperties.waitHours),
      })
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateEditAutoStartQuests',
          message: 'Failed to update auto start quests tool',
          message_json: err,
        }};
      });
  };

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: [ HABITICA_QUERY_KEY ]});
    queryClient.invalidateQueries({ queryKey: [ 'useApiListEventMessages', 'auto-start-quests-messages' ]});
  };

  return useMutation({ mutationFn, onSuccess, ...mutateOptions });
};
