import { useMutation } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';


export const useMutateSignUp = (mutateOptions) => {
  const axios = useAxios();

  const mutationFn = (payload) => {
    const sanitizedPayload = sanitizeProperties(payload, {
      requiredKeys: [ 'first_name', 'last_name', 'email', 'password', 'hcaptchaToken' ],
    });

    return axios
      .post('/v1/users/sign_up', sanitizedPayload.properties)
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateSignUp',
          message: 'Failed to sign up',
          message_json: err,
        }};
      });
  };


  return useMutation({ mutationFn, ...mutateOptions });
};