import { useMutation } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';


export const useMutateResolveEmailConfirmation = (mutateOptions) => {
  const axios = useAxios();

  const mutationFn = (payload) => {
    const sanitizedPayload = sanitizeProperties(payload, {
      requiredKeys: [ 'type', 'token' ],
      optionalKeys: [ 'options' ],
    });
    const { type, token, options } = sanitizedPayload.properties;

    return axios
      .post(`/v1/email_confirmations/resolve/${ type }/${ token }`, options)
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateResolveEmailConfirmation',
          message: 'Failed to verify an email confirmation',
          message_json: err,
        }};
      });
  };

  return useMutation({ mutationFn, ...mutateOptions });
};
