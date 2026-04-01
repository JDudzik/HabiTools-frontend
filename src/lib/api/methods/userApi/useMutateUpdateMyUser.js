import { useMutation } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';


export const useMutateUpdateMyUser = (mutateOptions) => {
  const axios = useAxios();

  const mutationFn = (payload) => {
    const sanitizedPayload = sanitizeProperties(payload, {
      optionalKeys: [ 'age', 'gender', 'coach_id', 'last_name', 'first_name' ],
      atLeastOneOptionalProp: true,
    });

    return axios
      .put('/v1/auth/users/update_my_user', sanitizedPayload.properties)
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateUpdateMyUser',
          message: 'Failed to update user',
          message_json: err,
        }};
      });
  };

  return useMutation({ mutationFn, ...mutateOptions });
};
