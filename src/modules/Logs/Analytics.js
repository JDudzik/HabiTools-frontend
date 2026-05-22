import { useState, useEffect } from 'react';
import { PageHead, L, VirtualizedTableSimple, SimpleDisplay, Link, SquareIconButton } from 'components';
import { usePageManager } from 'lib/hooks';
import {
  Button,
  Stack,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useApiListAnalyticLogs } from 'lib/api/methods/analyticApi/useApiListAnalyticLogs';
import { useApiSingleAnalyticLog } from 'lib/api/methods/analyticApi/useApiSingleAnalyticLog';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


const AnalyticLogs = () => {
  const [ selectedLogId, setSelectedLogId ] = useState();
  const [ currentLogsPage, setCurrentLogsPage ] = useState(1);
  const [ shouldHideApiHits, setShouldHideApiHits ] = useState(false);

  const {
    data: analyticLogs,
    isLoading: isLoadingAnalyticLogs,
    error: analyticLogsError,
  } = useApiListAnalyticLogs({ pageNumber: currentLogsPage, hideApi: shouldHideApiHits });

  const {
    pageStage,
    openConfirmation,
  } = usePageManager({
    defaultHandleApiError: {
      returnPath: '/logs/analytics',
      handledErrors: [],
    },
    defaultPageStage: 'loading',
    apiIsLoading: isLoadingAnalyticLogs,
    apiErrors: analyticLogsError,
  });
  
  const { data: selectedAnalyticLog } = useApiSingleAnalyticLog(selectedLogId);
  useEffect(() => {
    if (selectedAnalyticLog) {
      openConfirmation({
        content: (
          <div>
            <SimpleDisplay sensitive title="Datetime" sx={{ flexGrow: 1, m: 1, overflowWrap: 'break-word' }} color="secondary.main">
              { new Date(parseInt(selectedAnalyticLog.created_at, 10)).toLocaleString() }
            </SimpleDisplay>

            <SimpleDisplay sensitive title="Source" sx={{ flexGrow: 1, m: 1, overflowWrap: 'break-word' }} color="secondary.main">
              { selectedAnalyticLog.source }
            </SimpleDisplay>

            { selectedAnalyticLog?.user?.email && (
              <SimpleDisplay sensitive title="From User" sx={{ flexGrow: 1, m: 1, overflowWrap: 'break-word' }} color="secondary.main">
                { selectedAnalyticLog?.user?.email }<br />
                { selectedAnalyticLog?.user?.first_name } { selectedAnalyticLog?.user?.last_name }
              </SimpleDisplay>
            ) }

            <SimpleDisplay sensitive title="Action Name" sx={{ flexGrow: 1, m: 1, overflowWrap: 'break-word' }} color="secondary.main">
              { selectedAnalyticLog.action_name }
            </SimpleDisplay>

            <SimpleDisplay sensitive title="Action Value" sx={{ flexGrow: 1, m: 1, overflowWrap: 'break-word' }} color="secondary.main">
              <L.p sx={{ whiteSpace: 'pre-wrap' }}>{ selectedAnalyticLog.action_value }</L.p>
            </SimpleDisplay>
          </div>
        ),
        removeSecondaryAction: true,
        primaryButtonText: 'Close',
        onRequestSubmit: () => setSelectedLogId(null),
      });
    }
  }, [ openConfirmation, selectedAnalyticLog ]);

  return (
    <>
      <PageHead title="Analytic Logs" />
      <>
        <Stack flexDirection="row" justifyContent="flex-start" width="100%">
          <Link href="/">
            <Button>
              <ArrowBackIcon /> Home
            </Button>
          </Link>
        </Stack>

        <>
          <Stack flexDirection="column" sx={{ width: '100%', maxWidth: '100%', mt: 1 }}>
            <L.section>
              <VirtualizedTableSimple
                size="small"
                height={{ xxs: '50vh', sm: '60vh', md: '65vh' }}
                title="Analytic Logs"
                subtitle={ (
                  <Stack
                    alignItems="center"
                    my={ 1 }
                    direction={{ xxs: 'column', hmd: 'row' }}
                    justifyContent="space-between"
                    width="100%"
                    maxWidth="50em"
                    sx={{ position: 'relative' }}
                  >
                    <FormControlLabel
                      label="Hide API Hits"
                      control={ (
                        <Checkbox
                          color="secondary"
                          checked={ shouldHideApiHits }
                          sx={{
                            '&.Mui-checked': {
                              color: 'text.black',
                            },
                          }}
                          onChange={ (e) => {
                            setShouldHideApiHits(e.target.checked);
                            setCurrentLogsPage(1);
                          } }
                        />
                      ) }
                    />
                    <Stack
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
                        disabled={ analyticLogs?.length < 50 }
                        onClick={ () => setCurrentLogsPage(currentLogsPage + 1) }
                      />
                    </Stack>
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
                  width: '100px',
                }, {
                  label: 'Action Name',
                  key: 'action-name',
                  width: '170px',
                }, {
                  label: 'Value Preview',
                  key: 'value-preview',
                  width: '200px',
                }] }
                rows={ analyticLogs?.map?.(analyticLog => ({
                  onClick: () => setSelectedLogId(analyticLog.id),
                  columns: [
                    { key: analyticLog.id, element: new Date(parseInt(analyticLog.created_at, 10)).toLocaleString() },
                    { key: 1, element: analyticLog.source },
                    { key: 2, element: analyticLog.action_name.length > 30 ? `${ analyticLog.action_name.substring(0, 30) }...` : analyticLog.action_name },
                    { key: 3, element: analyticLog.action_value.length > 30 ? `${ analyticLog.action_value.substring(0, 30) }...` : analyticLog.action_value },
                  ],
                })) }
              />
            </L.section>
          </Stack>
        </>
      </>
    </>
  );
};

export default AnalyticLogs;