import { useState, useEffect } from 'react';
import { PageHead, L, VirtualizedTableSimple, SimpleDisplay, Link, SquareIconButton } from 'components';
import { usePageManager } from 'lib/hooks';
import {
  Button,
  Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useApiListErrorLogs } from 'lib/api/methods/errorApi/useApiListErrorLogs';
import { useApiSingleErrorLog } from 'lib/api/methods/errorApi/useApiSingleErrorLog';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


const ErrorLogs = () => {
  const [ selectedLogId, setSelectedLogId ] = useState();
  const [ currentLogsPage, setCurrentLogsPage ] = useState(1);

  const {
    data: errorLogs,
    isLoading: isLoadingErrorLogs,
    error: errorLogsError,
  } = useApiListErrorLogs(currentLogsPage);

  const {
    pageStage,
    openConfirmation,
  } = usePageManager({
    defaultHandleApiError: {
      returnPath: '/logs/errors',
      handledErrors: [],
    },
    defaultPageStage: 'loading',
    apiIsLoading: isLoadingErrorLogs,
    apiErrors: errorLogsError,
  });

  const { data: selectedErrorLog } = useApiSingleErrorLog(selectedLogId);
  useEffect(() => {
    if (selectedErrorLog) {
      openConfirmation({
        content: (
          <div>
            <SimpleDisplay sensitive title="Datetime" sx={{ flexGrow: 1, m: 1, overflowWrap: 'break-word' }} color="secondary.main">
              { new Date(parseInt(selectedErrorLog.created_at, 10)).toLocaleString() }
            </SimpleDisplay>

            <SimpleDisplay sensitive title="Source" sx={{ flexGrow: 1, m: 1, overflowWrap: 'break-word' }} color="secondary.main">
              { selectedErrorLog.source }
            </SimpleDisplay>

            { selectedErrorLog?.user?.email && (
              <SimpleDisplay sensitive title="From User" sx={{ flexGrow: 1, m: 1, overflowWrap: 'break-word' }} color="secondary.main">
                { selectedErrorLog?.user?.email }<br />
                { selectedErrorLog?.user?.first_name } { selectedErrorLog?.user?.last_name }
              </SimpleDisplay>
            ) }

            <SimpleDisplay sensitive title="Message" sx={{ flexGrow: 1, m: 1, overflowWrap: 'break-word' }} color="secondary.main">
              <L.p sx={{ whiteSpace: 'pre-wrap' }}>{ selectedErrorLog.message }</L.p>
            </SimpleDisplay>

            <SimpleDisplay sensitive title="Message JSON" sx={{ flexGrow: 1, m: 1, overflowWrap: 'break-word' }} color="secondary.main">
              <L.p sx={{ whiteSpace: 'pre-wrap' }}>{ selectedErrorLog.message_json }</L.p>
            </SimpleDisplay>
          </div>
        ),
        removeSecondaryAction: true,
        primaryButtonText: 'Close',
        onRequestSubmit: () => setSelectedLogId(null),
      });
    }
  }, [ openConfirmation, selectedErrorLog ]);

  return (
    <>
      <PageHead title="Error Logs" />
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
              title="Error Logs"
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
                    disabled={ errorLogs?.length < 50 }
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
                width: '200px',
              }, {
                label: 'Preview',
                key: 'preview',
                width: '200px',
              }] }
              rows={ errorLogs?.map?.(errorLog => ({
                onClick: () => { setSelectedLogId(errorLog.id); },
                columns: [
                  { key: errorLog.id, element: new Date(parseInt(errorLog.created_at, 10)).toLocaleString() },
                  { key: 1, element: errorLog?.source?.length > 20 ? `${ errorLog?.source.substring(0, 20) }...` : errorLog.source },
                  { key: 2, element: errorLog?.message?.length > 25 ? `${ errorLog?.message.substring(0, 25) }...` : errorLog.message },
                ],
              })) }
            />
          </L.section>
        </Stack>
      </>
    </>
  );
};

export default ErrorLogs;