import React, { useState, useEffect } from 'react';
import { Stack, CircularProgress, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { PageHead, L, AuthCtaButtons, HabiticaAccountManagerModal } from 'components';
import { useApiVoteQuestVoting } from 'lib/api/methods/habiticaApi';


const QuestVotingVotePage = () => {
  const router = useRouter();
  const partyId = router?.query?.party_id;
  const selectionId = router?.query?.selection_id;
  const [ attemptedClose, setAttemptedClose ] = useState(false);
  const [ failedClose, setFailedClose ] = useState(false);
  const [ habiticaAccountManagerModalOpen, setHabiticaAccountManagerModalOpen ] = useState(false);

  useEffect(() => {
    if (attemptedClose && !failedClose) {
      setTimeout(() => {
        if (!window.closed) {
          setFailedClose(true);
        }
      }, 1000);
    }
  }, [ attemptedClose, failedClose ]);

  const { data, isLoading, error, invalidateQuery } = useApiVoteQuestVoting({
    enabled: router?.isReady,
    partyId,
    selectionId,
  });

  const errorMessage = error?.response?.data?.message || error?.errorPayload?.message || 'Unable to submit vote.';
  const errorStatus = error?.response?.data?.status;

  const showAuthForErrors = [ 'QUEST_VOTE_LOGIN_REQUIRED' ];
  const showHabiticaLinking = [ 'QUEST_VOTE_LINK_REQUIRED' ];

  return (
    <>
      <PageHead title="Quest Voting Vote" />

      <Stack
        spacing={ 3 }
        direction="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
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
            <Stack spacing={ 1 } justifyContent="center" alignItems="center">
              <L.h3 color="error">Vote Not Counted</L.h3>
              <L.p>{ errorMessage }</L.p>
              {showAuthForErrors.includes(errorStatus) && (
                <AuthCtaButtons returnPath={ `/tools/quest-voting/vote/?party_id=${ partyId }&selection_id=${ selectionId }` } />
              )}
              {(showHabiticaLinking.includes(errorStatus) || !!habiticaAccountManagerModalOpen) && (
                <L.section>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={ () => setHabiticaAccountManagerModalOpen(true) }
                  >
                    Manage Habitica Account
                  </Button>
                
                  <HabiticaAccountManagerModal
                    open={ habiticaAccountManagerModalOpen }
                    onClose={ () => {
                      invalidateQuery();
                      setHabiticaAccountManagerModalOpen(false);
                    } }
                  />
                </L.section>
              )}
            </Stack>
          </L.section>
        )}

        {!isLoading && !error && data?.success && (
          <L.section>
            <L.h3>Vote Counted</L.h3>
            <L.p>{ data?.message || 'Your vote was counted successfully.' }</L.p>
          </L.section>
        )}
        {!isLoading && ![ ...showAuthForErrors, ...showHabiticaLinking ].includes(errorStatus) && (
          <L.section>
            <br />
            <L.p>You may now close this screen.</L.p>

            {!failedClose && (
              <Button
                variant="outlined"
                color="info"
                disabled={ attemptedClose }
                loading={ attemptedClose && !failedClose }
                onClick={ () => {
                  setAttemptedClose(true);
                  window.close();
                } }
              >
                Close
              </Button>
            )}  
            
            <L.p>{ failedClose && 'Failed to close automatically. Please close manually.' }</L.p>
          </L.section>
        )}
      </Stack>
    </>
  );
};

export default QuestVotingVotePage;
