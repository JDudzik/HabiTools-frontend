import { useMutation } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';
import { isErrorIgnored } from './internal';
import posthog from 'posthog-js';


const stringifyNestedProps = obj => Object.fromEntries(
  Object.entries(obj).map(([ key, value ]) => [ key, typeof value === 'object' && value !== null ? JSON.stringify(value) : value ]),
);

export const useMutateSubmitError = (mutateOptions) => {
  const axios = useAxios();

  const mutationFn = (payload, passedOptions) => {
    const options = {
      sendToPosthog: true,
      ...passedOptions,
    };

    const sanitizedPayload = sanitizeProperties(payload, {
      requiredKeys: [ 'source' ],
      optionalKeys: [ 'message', 'message_json' ],
      atLeastOneOptionalProp: true,
    });

    if (isErrorIgnored(sanitizedPayload.properties.message)) {
      return false;
    }
    
    if (options?.sendToPosthog) {
      posthog.captureException(
        `${ payload?.source } -- ${ payload?.message || 'No Message' }`,
        stringifyNestedProps(payload),
      );
    }

    return axios
      .post('/v1/error-submissions/submit', sanitizedPayload.properties)
      .then(res => res.data)
      .catch((err) => { throw err; });
  };

  return useMutation({
    mutationFn,
    timeout: 4000, // 4 seconds
    ...mutateOptions,
  });
};
