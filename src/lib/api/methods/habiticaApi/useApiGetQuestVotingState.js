import { useQuery } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { useContext } from 'react';
import { userContext } from 'lib/contexts/UserContext';


const BASE_QUERY_KEY = 'useApiGetQuestVotingState';

export const useApiGetQuestVotingState = (config) => {
  const { userState } = useContext(userContext);
  const axios = useAxios();
  const { enabled = userState?.isLoggedIn } = config || {};

  const queryFn = () => axios
    .get('/v1/auth/habitica/tools/quest-voting/state')
    .then(res => res?.data || null)
    .catch((err) => {
      throw { ...err, errorPayload: {
        source: 'useApiGetQuestVotingState',
        message: 'Failed to get Quest Voting state',
        message_json: err,
      }};
    });

  return useQuery({
    queryKey: [ BASE_QUERY_KEY ],
    queryFn,
    enabled,
  });
};
