import React, { useMemo, useState, useCallback } from 'react';
import {
  Stack,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { PageHead, L, MarkdownMui, LoadingElement, Link } from 'components';
import { usePageManager } from 'lib/hooks';
import {
  useApiGetHabitica,
  useApiGetHabiticaPartyInfo,
  useMutateSendHabiticaPartyShout,
} from 'lib/api/methods/habiticaApi';
import { ToolCockpit } from '../components';
import toolDescriptionContent from './content/toolDescription.md';


const PARTY_SHOUT_MESSAGE_MAX_LENGTH = 2200;


const PartyShoutPage = () => {
  const [ messageText, setMessageText ] = useState('');
  const [ isSubmittingShout, setIsSubmittingShout ] = useState(false);

  const {
    data: habiticaData,
    isLoading: isLoadingHabitica,
    error: habiticaError,
    isEnabled: isEnabledHabitica,
  } = useApiGetHabitica();

  const hasLinkedHabiticaAccount = !!habiticaData?.id;

  const {
    data: partyInfo,
    isLoading: isLoadingPartyInfo,
    error: partyInfoError,
  } = useApiGetHabiticaPartyInfo({
    enabled: !isLoadingHabitica && hasLinkedHabiticaAccount,
  });

  const { mutate: mutateSendPartyShout, isPending: isSendingPartyShout } = useMutateSendHabiticaPartyShout();

  const {
    openConfirmation,
    handleApiError,
  } = usePageManager({
    defaultHandleApiError: {
      returnPath: '/tools/party-shout',
      handledErrors: [ 'HABITICA_USER_NOT_FOUND' ],
    },
    defaultRoutingPath: '/tools/party-shout',
    defaultPageStage: 'loading',
    apiIsLoading: isLoadingHabitica || (hasLinkedHabiticaAccount && isLoadingPartyInfo),
    apiErrors: habiticaError || partyInfoError,
  });


  const isPartyLeader = !!partyInfo?.isLeader;
  const isSendInProgress = isSubmittingShout || isSendingPartyShout;
  const trimmedMessage = useMemo(() => messageText?.trim?.() || '', [ messageText ]);
  const messageCharacterCount = messageText.length;

  const handlePreviewMessage = useCallback(() => {
    if (!trimmedMessage) { return; }

    openConfirmation?.({
      title: 'Preview Party Shout',
      secondaryButtonText: 'Cancel',
      primaryButtonText: 'Send',
      content: (
        <Stack spacing={ 2 } mt={ 1 }>
          <L.p color="text.darkGrey">
            Confirm this message before sending it to your entire party.<br />
            Note: Not all special formatting translates perfectly to Habitica.
          </L.p>
          
          <L.section sx={{ border: 1, borderColor: 'divider', borderRadius: 2, px: 2, py: 1 }}>
            <MarkdownMui.Markdown options={{ skipNewlines: true }} >
              {`
${ trimmedMessage }

---
*[Party shout via HabiTools](https://habitools.online/)*
*[@member]() [@member]() [@member]() [@member]() [@member]()*`}
              
            </MarkdownMui.Markdown>
          </L.section>
        </Stack>
      ),
      onRequestSubmit: () => {
        setIsSubmittingShout(true);
        mutateSendPartyShout({
          messageText: trimmedMessage,
        }, {
          onSuccess: () => {
            setMessageText('');
            openConfirmation?.({
              title: 'Party Shout Sent',
              content: 'Your party shout was sent successfully.',
              primaryButtonText: 'Close',
              removeSecondaryAction: true,
            });
          },
          onError: (error) => {
            handleApiError({
              error,
              handledErrors: [
                'MISSING_FIELDS',
                'INVALID_PROPERTY_VALUE',
                'NOT_PARTY_LEADER',
                'HABITICA_PARTY_SHOUT_FAILED',
                'HABITICA_PARTY_INFO_FAILED',
                'HABITICA_PARTY_MEMBERS_FAILED',
                'HABITICA_API_FAILED',
              ],
            });
          },
          onSettled: () => {
            setIsSubmittingShout(false);
          },
        });
      },
    });
  }, [ trimmedMessage, openConfirmation, mutateSendPartyShout, handleApiError ]);

  return (
    <>
      <PageHead title="Party Shout" />

      <Stack
        spacing={{ xxs: 10, md: 12 }}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ paddingY: 4 }}
      >
        <Stack
          data-section="section1"
          spacing={{ xxs: 4, md: 6 }}
          width="100%"
          maxWidth="60em"
          direction={{ xxs: 'column-reverse', md: 'row-reverse' }}
          alignItems="start"
          textAlign={{ xxs: 'center', md: 'left' }}
        >
          <Stack spacing={ 4 } width="100%">
            <L.h1 align="center" color="text.softBlack">
              Party Shout
            </L.h1>

            <L.section>
              <MarkdownMui.Markdown options={{ skipNewlines: false }} >
                { toolDescriptionContent }
              </MarkdownMui.Markdown>
            </L.section>

            {/* {!hasLinkedHabiticaAccount && (
              <ToolCockpit
                habiticaData={ habiticaData }
                toolInstance={ null }
                isLoading={ isLoadingHabitica }
                skipInitialLoading={ isEnabledHabitica }
                openConfirmation={ openConfirmation }
                returnPath="/tools/party-shout"
              />
            )}

            {hasLinkedHabiticaAccount && isLoadingPartyInfo && (
              <L.section>
                <Stack minHeight={ 100 } alignItems="center" justifyContent="center">
                  <LoadingElement circular visibilityDelay={ 0 } />
                </Stack>
              </L.section>
            )}

            {hasLinkedHabiticaAccount && !isLoadingPartyInfo && !isPartyLeader && (
              <L.section>
                <Alert severity="info" sx={{ fontSize: '1rem' }}>
                  Only the current party leader can send party shouts.
                </Alert>
              </L.section>
            )}

            {hasLinkedHabiticaAccount && !isLoadingPartyInfo && isPartyLeader && (
              <L.section>
                <Stack spacing={ 2 } sx={{ mt: 2 }}>
                  <Stack>
                    <L.h3 sx={{ m: 0 }}>Compose Message</L.h3>
                    <Link href="https://github.com/HabitRPG/habitica/wiki/Markdown-in-Habitica">Markdown formatting help</Link>
                  </Stack>

                  <Stack>
                    <TextField
                      multiline
                      minRows={ 8 }
                      size="small"
                      label="Party Shout Message"
                      placeholder="Write your message to your party"
                      value={ messageText }
                      disabled={ isSendInProgress }
                      inputProps={{ maxLength: PARTY_SHOUT_MESSAGE_MAX_LENGTH }}
                      onChange={ (event) => {
                        setMessageText(event.target.value.slice(0, PARTY_SHOUT_MESSAGE_MAX_LENGTH));
                      } }
                    />
                    <L.p
                      sx={{ m: 0 }}
                      color="textSecondary"
                      align="right"
                    >
                      {`${ messageCharacterCount } / ${ PARTY_SHOUT_MESSAGE_MAX_LENGTH }`}
                    </L.p>
                  </Stack>

                  {isSendInProgress && (
                    <Alert severity="info">
                      This can take up to 15 seconds, please wait...
                    </Alert>
                  )}

                  <Stack direction="row" justifyContent="flex-end">
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={ !trimmedMessage || isSendInProgress }
                      startIcon={ isSendInProgress ? <CircularProgress size={ 18 } /> : null }
                      onClick={ handlePreviewMessage }
                    >
                      Preview Message
                    </Button>
                  </Stack>

                  
                </Stack>
              </L.section>
            )} */}
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default PartyShoutPage;
