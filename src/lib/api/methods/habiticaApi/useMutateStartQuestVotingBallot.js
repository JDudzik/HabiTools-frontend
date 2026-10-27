import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';


const QUEST_VOTING_QUERY_KEY = 'useApiGetQuestVotingState';

export const useMutateStartQuestVotingBallot = (mutateOptions) => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const mutationFn = payload => axios
    .put('/v1/auth/habitica/tools/quest-voting/new-ballot', payload || {})
    .then(res => res.data)
    .catch((err) => {
      throw { ...err, errorPayload: {
        source: 'useMutateStartQuestVotingBallot',
        message: 'Failed to start a new Quest Voting ballot',
        message_json: err,
      }};
    });

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: [ QUEST_VOTING_QUERY_KEY ]});
  };

  return useMutation({ mutationFn, onSuccess, ...mutateOptions });
};
