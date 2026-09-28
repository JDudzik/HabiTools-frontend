import React from 'react';
import { Stack, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { PageHead, L } from 'components';
import { useApiVoteQuestVoting } from 'lib/api/methods/habiticaApi';


const QuestVotingVotePage = () => {
  const router = useRouter();
  const partyId = router?.query?.party_id;
  const selectionId = router?.query?.selection_id;

  const { data, isLoading, error } = useApiVoteQuestVoting({
    enabled: router?.isReady,
    partyId,
    selectionId,
  });

  const errorMessage = error?.response?.data?.message || error?.errorPayload?.message || 'Unable to submit vote.';

  return (
    <>
      <PageHead title="Quest Voting Vote" />

      <Stack
        spacing={ 3 }
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ paddingY: 10, px: 2 }}
      >
        <L.h1 align="center" color="text.softBlack">Quest Voting</L.h1>

        {isLoading && (
          <Stack spacing={ 2 } alignItems="center">
            <CircularProgress />
            <L.p>Submitting your vote...</L.p>
          </Stack>
        )}

        {!isLoading && error && (
          <L.section>
            <L.h3>Vote Not Counted</L.h3>
            <L.p>{ errorMessage }</L.p>
          </L.section>
        )}

        {!isLoading && !error && data?.success && (
          <L.section>
            <L.h3>Vote Counted</L.h3>
            <L.p>{ data?.message || 'Your vote was counted successfully.' }</L.p>
          </L.section>
        )}
      </Stack>
    </>
  );
};

export default QuestVotingVotePage;
