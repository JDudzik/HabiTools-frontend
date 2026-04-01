import { useState, useEffect } from 'react';
import { PageHead, L, VirtualizedTableSimple, SimpleDisplay, Link, SquareIconButton } from 'components';
import { usePageManager } from 'lib/hooks';
import {
  Button,
  Stack,
} from '@mui/material';
import { useApiListFeedbackLogs } from 'lib/api/methods/feedbackApi/useApiListFeedbackLogs';
import { useApiSingleFeedbackLog } from 'lib/api/methods/feedbackApi/useApiSingleFeedbackLog';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


const FeedbackLogs = () => {
  const [ selectedLogId, setSelectedLogId ] = useState();
  const [ currentLogsPage, setCurrentLogsPage ] = useState(1);

  const {
    data: feedbackLogs,
    isLoading: isLoadingFeedbackLogs,
    error: feedbackLogsError,
  } = useApiListFeedbackLogs(currentLogsPage);

  const {
    pageStage,
    openConfirmation,
  } = usePageManager({
    defaultHandleApiError: {
      returnPath: '/logs/errors',
      handledErrors: [],
    },
    defaultPageStage: 'loading',
    apiIsLoading: isLoadingFeedbackLogs,
    apiErrors: feedbackLogsError,
  });

  const { data: selectedFeedbackLog } = useApiSingleFeedbackLog(selectedLogId);
  useEffect(() => {
    if (selectedFeedbackLog) {
      openConfirmation({
        content: (
          <div>
            <SimpleDisplay sensitive title="Datetime" sx={{ flexGrow: 1, m: 1, overflowWrap: 'break-word' }} color="secondary.main">
              { new Date(parseInt(selectedFeedbackLog.created_at, 10)).toLocaleString() }
            </SimpleDisplay>

            <SimpleDisplay sensitive title="Source" sx={{ flexGrow: 1, m: 1, overflowWrap: 'break-word' }} color="secondary.main">
              { selectedFeedbackLog.source || 'No source' }
            </SimpleDisplay>

            { (selectedFeedbackLog?.email || selectedFeedbackLog?.user?.email) && (
              <SimpleDisplay sensitive title="Provided Email" sx={{ flexGrow: 1, m: 1, overflowWrap: 'break-word' }} color="secondary.main">
                { selectedFeedbackLog.email }
                { selectedFeedbackLog?.user?.email && (
                  <SimpleDisplay sensitive title="Logged-in User" color="secondary.main" sx={{ m: 0, p: 0 }} cardSx={{ mx: '0 !important', mt: 1 }}>
                    { selectedFeedbackLog?.user?.email }<br />
                    { selectedFeedbackLog?.user?.first_name } { selectedFeedbackLog?.user?.last_name }
                  </SimpleDisplay>
                ) }
              </SimpleDisplay>
            ) }

            <SimpleDisplay sensitive title="Topic" sx={{ flexGrow: 1, m: 1, overflowWrap: 'break-word' }} color="secondary.main">
              { selectedFeedbackLog.topic }
            </SimpleDisplay>

            <SimpleDisplay sensitive title="Message" sx={{ flexGrow: 1, m: 1, overflowWrap: 'break-word' }} color="secondary.main">
              <L.p sx={{ whiteSpace: 'pre-wrap' }}>{ selectedFeedbackLog.message }</L.p>
            </SimpleDisplay>
          </div>
        ),
        removeSecondaryAction: true,
        primaryButtonText: 'Close',
        onRequestSubmit: () => setSelectedLogId(null),
      });
    }
  }, [ openConfirmation, selectedFeedbackLog ]);

  return (
    <>
      <PageHead title="Feedback Logs" />
      <>
        <Stack flexDirection="row" justifyContent="flex-start" width="100%">
          <Link href="/">
            <Button>
              <ArrowBackIcon /> Home
            </Button>
          </Link>
        </Stack>

        <Stack flexDirection="column" sx={{ width: '100%', maxWidth: '100%', mt: 1 }}>
          <L.section>
            <VirtualizedTableSimple
              size="small"
              height={{ xxs: '55vh', md: '60vh' }}
              title="Feedback Logs"
              subtitle={ (
                <Stack
                  my={ 1 }
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between" 
                  spacing={ 1 }
                >
                  <SquareIconButton
                    aria-label="Previous list of notifications"
                    color="secondary"
                    variant="contained"
                    icon={ <ArrowBackIosNewIcon /> }
                    disabled={ currentLogsPage === 1 }
                    onClick={ () => setCurrentLogsPage(currentLogsPage - 1) }
                  />
                  <L.p sx={{ color: 'text.white' }}>{ currentLogsPage }</L.p>
                  <SquareIconButton
                    aria-label="Next list of notifications"
                    color="secondary"
                    variant="contained"
                    icon={ <ArrowForwardIosIcon /> }
                    disabled={ feedbackLogs?.length < 50 }
                    onClick={ () => setCurrentLogsPage(currentLogsPage + 1) }
                  />
                </Stack>
              ) }
              isLoading={ pageStage === 'loading' }
              headers={ [{
                label: 'Timestamp',
                key: 'timestamp',
                width: '120px',
              }, {
                label: 'Source',
                key: 'source',
                width: '150px',
              }, {
                label: 'Topic',
                key: 'topic',
                width: '150px',
              }, {
                label: 'Preview',
                key: 'preview',
                width: '200px',
              }] }
              rows={ feedbackLogs?.map?.(feedbackLog => ({
                onClick: () => setSelectedLogId(feedbackLog.id),
                columns: [
                  { key: feedbackLog.id, element: new Date(parseInt(feedbackLog.created_at, 10)).toLocaleString() },
                  { key: 1, element: feedbackLog.source || '-' },
                  { key: 2, element: feedbackLog.topic.length > 25 ? `${ feedbackLog.topic.substring(0, 25) }...` : feedbackLog.topic },
                  { key: 3, element: feedbackLog.message.length > 25 ? `${ feedbackLog.message.substring(0, 25) }...` : feedbackLog.message },
                ],
              })) }
            />
          </L.section>
        </Stack>
      </>
    </>
  );
};

export default FeedbackLogs;