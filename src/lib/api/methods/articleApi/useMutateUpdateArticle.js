import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';


export const useMutateUpdateArticle = (mutateOptions) => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  const mutationFn = (payload) => {
    const sanitizedPayload = sanitizeProperties(payload, {
      requiredKeys: [ 'id' ],
      optionalKeys: [ 'title', 'tags', 'content' ],
      atLeastOneOptionalProp: true,
    });

    return axios
      .put('/v1/auth/articles/update', [ sanitizedPayload.properties ])
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateUpdateArticle',
          message: 'Failed to update an article',
          message_json: err,
        }};
      });
  };

  const onSuccess = (result) => {
    queryClient.refetchQueries({ queryKey: [ 'useApiGetArticle', result[0].id ]});
    queryClient.refetchQueries({ queryKey: [ 'useApiGetArticle', result[0].slug ]});
    queryClient.refetchQueries({ queryKey: [ 'useApiListArticles' ]});
  };

  return useMutation({ mutationFn, onSuccess, ...mutateOptions });
};
