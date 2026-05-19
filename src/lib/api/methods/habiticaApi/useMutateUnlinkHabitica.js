import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';


const HABITICA_QUERY_KEY = [ 'useApiGetHabitica' ];

export const useMutateUnlinkHabitica = (mutateOptions) => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const mutationFn = () => {
    return axios
      .delete('/v1/auth/habitica/unlink')
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateUnlinkHabitica',
          message: 'Failed to unlink Habitica account',
          message_json: err,
        }};
      });
  };

  const onSuccess = () => {
    queryClient.removeQueries({ queryKey: HABITICA_QUERY_KEY });
  };

  return useMutation({ mutationFn, onSuccess, ...mutateOptions });
};
