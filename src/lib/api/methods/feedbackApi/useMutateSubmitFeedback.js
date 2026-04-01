import { useMutation } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';


export const useMutateSubmitFeedback = (mutateOptions) => {
  const axios = useAxios();

  const mutationFn = (payload) => {
    const sanitizedPayload = sanitizeProperties(payload, {
      requiredKeys: [ 'topic', 'email', 'message' ],
      optionalKeys: [ 'source' ],
    });

    return axios
      .post('/v1/feedbacks/submit', sanitizedPayload.properties)
      .then(res => res.data);
  };

  return useMutation({ mutationFn, ...mutateOptions });
};
