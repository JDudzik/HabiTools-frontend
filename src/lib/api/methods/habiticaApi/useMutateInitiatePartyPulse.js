import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';


const HABITICA_QUERY_KEY = 'useApiGetHabitica';

export const useMutateInitiatePartyPulse = (mutateOptions) => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const mutationFn = () => {
    return axios
      .post('/v1/auth/habitica/tools/party-pulse')
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateInitiatePartyPulse',
          message: 'Failed to initiate party pulse tool',
          message_json: err,
        }};
      });
  };

  const onSuccess = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    queryClient.invalidateQueries({ queryKey: [ HABITICA_QUERY_KEY ]});
    queryClient.invalidateQueries({ queryKey: [ 'useApiListEventMessages', 'party-pulse' ]});
  };

  return useMutation({ mutationFn, onSuccess, ...mutateOptions });
};
