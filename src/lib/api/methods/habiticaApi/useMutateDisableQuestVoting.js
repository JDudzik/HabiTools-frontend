import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';


const HABITICA_QUERY_KEY = 'useApiGetHabitica';
const QUEST_VOTING_QUERY_KEY = 'useApiGetQuestVotingState';

export const useMutateDisableQuestVoting = (mutateOptions) => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const mutationFn = () => axios
    .delete('/v1/auth/habitica/tools/quest-voting/disable')
    .then(res => res.data)
    .catch((err) => {
      throw { ...err, errorPayload: {
        source: 'useMutateDisableQuestVoting',
        message: 'Failed to disable Quest Voting',
        message_json: err,
      }};
    });

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: [ HABITICA_QUERY_KEY ]});
    queryClient.invalidateQueries({ queryKey: [ QUEST_VOTING_QUERY_KEY ]});
  };

  return useMutation({ mutationFn, onSuccess, ...mutateOptions });
};
