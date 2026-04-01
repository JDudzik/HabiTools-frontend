import { useMutation } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';


export const useMutateSubmitAnalytic = (mutateOptions) => {
  const axios = useAxios();

  const mutationFn = (payload) => {
    const sanitizedPayload = sanitizeProperties(payload, {
      requiredKeys: [ 'source', 'action_name', 'action_value' ],
    });

    return axios
      .post('/v1/analytics/submit', sanitizedPayload.properties)
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateSubmitAnalytic',
          message: 'Failed to submit feedback',
          message_json: err,
        }};
      });
  };

  return useMutation({
    mutationFn,
    timeout: 5000, // 5 seconds
    ...mutateOptions,
  });
};
