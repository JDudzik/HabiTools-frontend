import { useQuery } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';


const BASE_QUERY_KEY = 'useApiVoteQuestVoting';

export const useApiVoteQuestVoting = (config) => {
  const axios = useAxios();
  const {
    enabled = false,
    partyId,
    selectionId,
  } = config || {};

  const queryFn = () => axios
    .get(`/v1/habitica/tools/quest-voting/vote?party_id=${ encodeURIComponent(partyId) }&selection_id=${ encodeURIComponent(selectionId) }`)
    .then(res => res?.data || null)
    .catch((err) => {
      throw { ...err, errorPayload: {
        source: 'useApiVoteQuestVoting',
        message: 'Failed to cast Quest Voting vote',
        message_json: err,
      }};
    });

  return useQuery({
    queryKey: [ BASE_QUERY_KEY, { partyId, selectionId }],
    queryFn,
    enabled: enabled && !!partyId && !!selectionId,
    retry: false,
  });
};
