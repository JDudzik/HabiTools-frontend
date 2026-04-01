import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';


export const useMutateDeleteArticle = (mutateOptions) => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  const mutationFn = (payload) => {
    const sanitizedPayload = sanitizeProperties(payload, {
      requiredKeys: [ 'id' ],
    });

    return axios
      .delete(`/v1/auth/articles/delete/${ sanitizedPayload.properties.id }`)
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateDeleteArticle',
          message: 'Failed to delete an article',
          message_json: err,
        }};
      });

  };

  const onSuccess = (result) => {
    queryClient.removeQueries({ queryKey: [ 'useApiGetArticle', result.id ]});
    queryClient.removeQueries({ queryKey: [ 'useApiGetArticle', result.slug ]});
    queryClient.refetchQueries({ queryKey: [ 'useApiListArticles' ]});
  };

  return useMutation({ mutationFn, onSuccess, ...mutateOptions });
};
