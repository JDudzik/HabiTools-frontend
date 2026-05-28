import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';


const HABITICA_QUERY_KEY = 'useApiGetHabitica';

export const useMutateInitiateAutoStartQuests = (mutateOptions) => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const mutationFn = (payload) => {
    const sanitizedPayload = sanitizeProperties(payload, {
      requiredKeys: [ 'waitHours' ],
      trimPayload: true,
      removeDisallowedKeys: true,
    });
    const sanitizedProperties = sanitizedPayload.properties;

    return axios
      .post('/v1/auth/habitica/tools/auto-start-quests', {
        wait_hours: Number(sanitizedProperties.waitHours),
      })
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateInitiateAutoStartQuests',
          message: 'Failed to initiate auto start quests tool',
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
