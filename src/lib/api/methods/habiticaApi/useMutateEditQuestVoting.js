import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';


const HABITICA_QUERY_KEY = 'useApiGetHabitica';
const QUEST_VOTING_QUERY_KEY = 'useApiGetQuestVotingState';

export const useMutateEditQuestVoting = (mutateOptions) => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const mutationFn = (payload) => {
    const sanitizedPayload = sanitizeProperties(payload || {}, {
      optionalKeys: [ 'filterCategories', 'leaveOnePerQuest', 'partyWideFilter', 'secureVoting' ],
      trimPayload: true,
      removeDisallowedKeys: true,
    });
    const sanitizedProperties = sanitizedPayload.properties || {};

    return axios
      .put('/v1/auth/habitica/tools/quest-voting/edit', {
        filter_categories: sanitizedProperties.filterCategories,
        leave_one_per_quest: sanitizedProperties.leaveOnePerQuest,
        party_wide_filter: sanitizedProperties.partyWideFilter,
        secure_voting: sanitizedProperties.secureVoting,
      })
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateEditQuestVoting',
          message: 'Failed to edit Quest Voting settings',
          message_json: err,
        }};
      });
  };

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: [ HABITICA_QUERY_KEY ]});
    queryClient.invalidateQueries({ queryKey: [ QUEST_VOTING_QUERY_KEY ]});
  };

  return useMutation({ mutationFn, onSuccess, ...mutateOptions });
};
