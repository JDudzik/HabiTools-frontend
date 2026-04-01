import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';


export const useMutateUndeleteUser = (mutateOptions) => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const mutationFn = (payload) => {
    const sanitizedPayload = sanitizeProperties(payload, {
      requiredKeys: [ 'id' ],
    });

    return axios
      .delete(`/v1/auth/users/admin/undelete_user/${ sanitizedPayload.properties.id }`)
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateUndeleteUser',
          message: 'Failed to delete a user (from admin)',
          message_json: err,
        }};
      });
  };

  const onSuccess = () => {
    queryClient.invalidateQueries([ 'useApiSearchUsers' ]);
  };

  return useMutation({ mutationFn, onSuccess, ...mutateOptions });
};
