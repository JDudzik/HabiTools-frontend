import { useMutation } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';


export const useMutateSendGlobalHabiticaNotification = (mutateOptions) => {
  const axios = useAxios();

  const mutationFn = (payload) => {
    const sanitizedPayload = sanitizeProperties(payload, {
      requiredKeys: [ 'message_text' ],
      optionalKeys: [ 'short_message', 'event_name', 'priority' ],
      trimPayload: true,
      removeDisallowedKeys: true,
      parseInts: true,
      parseBools: true,
    });
    const sanitizedProperties = sanitizedPayload.properties;

    return axios
      .post('/v1/auth/habitica/global-notification', sanitizedProperties)
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateSendGlobalHabiticaNotification',
          message: 'Failed to send global Habitica notification',
          message_json: err,
        }};
      });
  };

  return useMutation({ mutationFn, ...mutateOptions });
};