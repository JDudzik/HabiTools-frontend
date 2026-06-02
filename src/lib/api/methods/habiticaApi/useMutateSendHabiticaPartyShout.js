import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';
import { isLength } from 'property-validator';


const PARTY_INFO_QUERY_KEY = 'useApiGetHabiticaPartyInfo';
const PARTY_SHOUT_MESSAGE_MAX_LENGTH = 2200;

export const useMutateSendHabiticaPartyShout = (mutateOptions) => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const mutationFn = (payload) => {
    const sanitizedPayload = sanitizeProperties(payload, {
      requiredKeys: [ 'messageText' ],
      trimPayload: true,
      removeDisallowedKeys: true,
      propertyValidations: [
        isLength('messageText', { min: 1, max: PARTY_SHOUT_MESSAGE_MAX_LENGTH }, `messageText must be between 1 and ${ PARTY_SHOUT_MESSAGE_MAX_LENGTH } characters`),
      ],
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
