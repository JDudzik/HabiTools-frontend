import { useMutation } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';


export const useMutateResendVerifyEmail = (mutateOptions) => {
  const axios = useAxios();

  const mutationFn = (payload) => {
    const sanitizedPayload = sanitizeProperties(payload, {
      requiredKeys: [ 'email' ],
    });

    return axios
      .post('/v1/users/resend_verify_email', sanitizedPayload.properties)
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateResendVerifyEmail',
          message: 'Failed to resend verify email',
          message_json: err,
        }};
      });
  };

  return useMutation({ mutationFn, ...mutateOptions });
};
