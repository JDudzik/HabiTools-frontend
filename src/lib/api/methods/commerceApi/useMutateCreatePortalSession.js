import { useMutation } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';
import { useRouter } from 'next/router';


export const useMutateCreatePortalSession = (mutateOptions) => {
  const axios = useAxios();
  const router = useRouter();

  const mutationFn = (payload) => {
    const sanitizedPayload = sanitizeProperties(payload, {
      optionalKeys: [ 'return_url' ],
      removeDisallowedKeys: true,
    });

    return axios
      .post('/v1/auth/commerce/create-portal-session', {
        return_url: `${ window.location.origin }/my-account`,
        ...sanitizedPayload.properties,
      })
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateCreatePortalSession',
          message: 'Failed to create portal session',
          message_json: err,
        }};
      });
  };

  const onSuccess = (result) => {
    // Navigate the user to the portal session URL and make sure the back-button takes them back to the My Account page (or wherever they came from)
    router.push(result.url);
  };

  return useMutation({ mutationFn, onSuccess, ...mutateOptions });
};
