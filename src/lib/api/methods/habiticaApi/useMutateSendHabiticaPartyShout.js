import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';


const PARTY_INFO_QUERY_KEY = 'useApiGetHabiticaPartyInfo';

export const useMutateSendHabiticaPartyShout = (mutateOptions) => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const mutationFn = (payload) => {
    const sanitizedPayload = sanitizeProperties(payload, {
      requiredKeys: [ 'messageText' ],
      trimPayload: true,
      removeDisallowedKeys: true,
    });
    const sanitizedProperties = sanitizedPayload.properties;

    return axios
      .post('/v1/auth/habitica/party-shout', {
        message_text: sanitizedProperties.messageText,
      })
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateSendHabiticaPartyShout',
          message: 'Failed to send Habitica party shout',
          message_json: err,
        }};
      });
  };

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: [ PARTY_INFO_QUERY_KEY ]});
  };

  return useMutation({ mutationFn, onSuccess, ...mutateOptions });
};
