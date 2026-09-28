import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';


const QUEST_VOTING_QUERY_KEY = 'useApiGetQuestVotingState';

export const useMutatePauseQuestVoting = (mutateOptions) => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const mutationFn = () => axios
    .put('/v1/auth/habitica/tools/quest-voting/pause')
    .then(res => res.data)
    .catch((err) => {
      throw { ...err, errorPayload: {
        source: 'useMutatePauseQuestVoting',
        message: 'Failed to pause Quest Voting',
        message_json: err,
      }};
    });

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: [ QUEST_VOTING_QUERY_KEY ]});
  };

  return useMutation({ mutationFn, onSuccess, ...mutateOptions });
};
