import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';


const HABITICA_QUERY_KEY = 'useApiGetHabitica';

export const useMutateInitiateAutoAcceptQuests = (mutateOptions) => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const mutationFn = () => {
    return axios
      .post('/v1/auth/habitica/tools/auto-accept-quests')
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateInitiateAutoAcceptQuests',
          message: 'Failed to initiate auto accept quests tool',
          message_json: err,
        }};
      });
  };

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: [ HABITICA_QUERY_KEY ]});
  };

  return useMutation({ mutationFn, onSuccess, ...mutateOptions });
};
