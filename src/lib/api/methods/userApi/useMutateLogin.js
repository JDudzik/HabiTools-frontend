import { useContext } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';
import { userContext } from 'lib/contexts/UserContext';
import posthog from 'posthog-js';


export const useMutateLogin = (mutateOptions) => {
  const { userDispatch } = useContext(userContext);
  const axios = useAxios();

  const mutationFn = (payload) => {
    const sanitizedPayload = sanitizeProperties(payload, {
      requiredKeys: [ 'email', 'password' ],
    });

    return axios
      .post('v1/login', sanitizedPayload.properties)
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateLogin',
          message: 'Failed to login',
          message_json: err,
        }};
      });
  };

  const onSuccess = (data) => {
    userDispatch({ type: 'SET_USER', payload: data });
    posthog.identify(data.user.email, {
      email: data.user.email,
      first_name: data.user.first_name,
      last_name: data.user.last_name,
    });
  };

  return useMutation({ mutationFn, onSuccess, ...mutateOptions });
};
