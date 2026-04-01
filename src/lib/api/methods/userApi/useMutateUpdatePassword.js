import { useMutation } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';


export const useMutateUpdatePassword = (mutateOptions) => {
  const axios = useAxios();

  const mutationFn = (payload) => {
    const sanitizedPayload = sanitizeProperties(payload, {
      requiredKeys: [ 'old_password', 'new_password' ],
    });

    return axios
      .put('/v1/auth/users/update_password', sanitizedPayload.properties)
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateUpdatePassword',
          message: 'Failed to update password',
          message_json: err,
        }};
      });
  };

  return useMutation({ mutationFn, ...mutateOptions });
};
