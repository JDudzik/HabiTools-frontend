import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';


export const useMutateExample = (mutateOptions) => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const mutationFn = (payload) => {
    const sanitizedPayload = sanitizeProperties(payload, {
      requiredKeys: [ 'email' ],
      // optionalKeys: [ 'name', 'age' ],
      // trimPayload: false,
      // removeDisallowedKeys: false,
      // atLeastOneOptionalProp: false,
      // shouldThrow: true,
      // propertyValidations,
    });

    return axios
      .put('/v1/users/resend_verify_email', sanitizedPayload.properties)
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateExample',
          message: 'Failed to ____',
          message_json: err,
        }};
      });
  };

  const onSettled = (_data, _error, payload) => {
    console.debug('email:', payload.email);
  };

  const onSuccess = (result, payload) => {
    console.debug('result:', result);
    console.debug('payload:', payload);
    queryClient.invalidateQueries({ queryKey: [ 'useMutateExample', payload.email ]});
  };

  return useMutation({ mutationFn, onSuccess, onSettled, ...mutateOptions });
};
