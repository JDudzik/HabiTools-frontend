import { useMutation } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';


export const useMutateResetPassword = (mutateOptions) => {
  const axios = useAxios();

  const mutationFn = (payload) => {
    const sanitizedPayload = sanitizeProperties(payload, {
      requiredKeys: [ 'email', 'hcaptchaToken' ],
    });

    return axios
      .put('/v1/users/reset_password', sanitizedPayload.properties)
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateResetPassword',
          message: 'Failed to reset password',
          message_json: err,
        }};
      });
  };

  return useMutation({ mutationFn, ...mutateOptions });
};
