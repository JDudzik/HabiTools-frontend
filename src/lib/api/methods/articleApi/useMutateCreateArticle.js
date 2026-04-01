import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';


export const useMutateCreateArticle = (mutateOptions) => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  const mutationFn = (payload) => {
    const sanitizedPayload = sanitizeProperties(payload, {
      requiredKeys: [ 'title', 'type', 'slug', 'deletable' ],
      optionalKeys: [ 'require_simple', 'disable_newlines', 'content', 'tags' ],
    });

    return axios
      .post('/v1/auth/articles/create_article', sanitizedPayload.properties)
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateCreateArticle',
          message: 'Failed to create an article',
          message_json: err,
        }};
      });
  };

  const onSuccess = () => {
    queryClient.refetchQueries({ queryKey: [ 'useApiListArticles' ]});
  };

  return useMutation({ mutationFn, onSuccess, ...mutateOptions });
};
