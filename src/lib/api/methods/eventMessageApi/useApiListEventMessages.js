import { useQuery } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';
import { optional, isNumeric, isUUID } from 'property-validator';


export const useApiListEventMessages = (payload, config) => {
  const { enabled = true, instance } = config || {};

  const axios = useAxios();

  const sanitizedPagination = sanitizeProperties(payload.pagination, {
    optionalKeys: [ 'page', 'page_size' ],
    trimPayload: true,
    removeDisallowedKeys: true,
    propertyValidations: [
      optional(isNumeric('page')),
      optional(isNumeric('page_size')),
    ],
  });

  // sanitize filters:
  const sanitizedFilters = sanitizeProperties(payload.filters, {
    optionalKeys: [
      'message_id',
      'resource_id',
      'event_slug',
      'should_notify',
      'priority',
      'min_priority',
      'max_priority',
      'acknowledged',
    ],
    trimPayload: true,
    removeDisallowedKeys: true,
    propertyValidations: [
      optional(isUUID('resource_id', 'The resource ID must be a valid UUID')),
    ],
  });

  const queryFn = () => axios
    .get('/v1/auth/event-messages/list', {
      params: {
        filters: sanitizedFilters.properties,
        pagination: sanitizedPagination.properties,
      },
    })
    .then(res => res.data)
    .catch((err) => {
      throw { ...err, errorPayload: {
        source: 'useApiListEventMessages',
        message: 'Failed to get list of event messages',
        message_json: err,
      }};
    });

  return useQuery({
    queryKey: [ 'useApiListEventMessages', instance, sanitizedFilters.properties, sanitizedPagination.properties ],
    queryFn,
    enabled,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: true,
    refetchInterval: 60000,
    staleTime: 60000,
  });
};
