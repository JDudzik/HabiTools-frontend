import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';


const QUEST_VOTING_QUERY_KEY = 'useApiGetQuestVotingState';

export const useMutateUnpauseQuestVoting = (mutateOptions) => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const mutationFn = payload => axios
    .put('/v1/auth/habitica/tools/quest-voting/unpause', payload || {})
    .then(res => res.data)
    .catch((err) => {
      throw { ...err, errorPayload: {
        source: 'useMutateUnpauseQuestVoting',
        message: 'Failed to unpause Quest Voting',
        message_json: err,
      }};
    });

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: [ QUEST_VOTING_QUERY_KEY ]});
  };

  return useMutation({ mutationFn, onSuccess, ...mutateOptions });
};
