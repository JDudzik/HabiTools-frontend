import React, { useContext, useState, useCallback, useMemo } from 'react';
import {
  Stack,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PageHead, L, VirtualizedTableSimple, MarkdownMui, SquareIconButton } from 'components';
import { usePageManager } from 'lib/hooks';
import { userContext } from 'lib/contexts/UserContext';
import {
  useApiGetHabitica,
  useMutateInitiateAutoStartQuests,
  useMutateRefreshTool,
  useMutateTeardownTool,
} from 'lib/api/methods/habiticaApi';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useApiListEventMessages } from 'lib/api/methods/eventMessageApi';
import { ToolCockpit } from '../components/ToolCockpit';
import toolDescriptionContent from './content/toolDescription.md';
import advancedDetailsContent from './content/advancedTechnicalDetails.md';

const TOOL_SLUG = 'auto_start_quests';


const AutoStartQuestsPage = () => {
  const { userState } = useContext(userContext);
  const [ expandedAccordion, setExpandedAccordion ] = useState(false);
  const [ currentMessagesPage, setCurrentMessagesPage ] = useState(1);
  const [ waitMode, setWaitMode ] = useState('24');

  const { data: habiticaData, isLoading: isLoadingHabitica, error: habiticaError } = useApiGetHabitica();

  const activeToolInstance = useMemo(() => {
    if (!habiticaData?.habitica_tools) { return null; }
    const tools = habiticaData.habitica_tools.filter(
      t => t.tool_slug === TOOL_SLUG,
    );
    return tools.length > 0 ? tools[0] : null;
  }, [ habiticaData?.habitica_tools ]);

  const { data: eventMessagesData, isLoading: isLoadingMessages, error: messagesError } = useApiListEventMessages(
    {
      filters: {
        resource_id: activeToolInstance?.id,
      },
      pagination: {
        page: currentMessagesPage,
        page_size: 50,
      },
    },
    {
      enabled: userState?.isLoggedIn && !!activeToolInstance?.id,
      instance: 'auto-start-quests-messages',
    },
  );

  const { mutate: mutateActivate, isPending: isActivating, error: activationError } = useMutateInitiateAutoStartQuests();
  const { mutate: mutateRefresh, isPending: isRefreshing, error: refreshError } = useMutateRefreshTool();
  const { mutate: mutateTeardown, isPending: isDeactivating, error: deactivationError } = useMutateTeardownTool();

  const {
    openConfirmation,
  } = usePageManager({
    defaultHandleApiError: {
      returnPath: '/tools/auto-start-quests',
      handledErrors: [ 'HABITICA_USER_NOT_FOUND' ],
    },
    defaultRoutingPath: '/tools/auto-start-quests',
    defaultPageStage: 'loading',
    apiIsLoading: isLoadingHabitica,
    apiErrors: habiticaError || messagesError || activationError || refreshError || deactivationError,
  });

  const handleActivate = useCallback(() => {
    mutateActivate({
      waitMode: String(waitMode),
    }, {
      onSuccess: () => {
        openConfirmation?.({
          title: 'Tool Activated',
          content: `Auto Start Quests is now active. Quests will start automatically after ${ waitMode } hour${ waitMode === '1' ? '' : 's' }.`,
          primaryButtonText: 'Got it',
          removeSecondaryAction: true,
        });
      },
    });
  }, [ mutateActivate, openConfirmation, waitMode ]);

  const handleRefresh = useCallback(() => {
    if (activeToolInstance?.id) {
      mutateRefresh({
        resourceId: activeToolInstance.id,
      });
    }
  }, [ activeToolInstance?.id, mutateRefresh ]);

  const handleDeactivate = useCallback(() => {
    if (activeToolInstance?.id) {
      mutateTeardown({
        resourceId: activeToolInstance.id,
      }, {
        onSuccess: () => {
          openConfirmation?.({
            title: 'Tool Deactivated',
            content: 'Auto Start Quests is now inactive. You can reactivate anytime.',
            primaryButtonText: 'Got it',
            removeSecondaryAction: true,
          });
        },
      });
    }
  }, [ activeToolInstance?.id, mutateTeardown, openConfirmation ]);

  const memoizedMessageRows = useMemo(() => {
    return eventMessagesData?.messages?.map?.(message => ({
      columns: [
        { key: 'timestamp', element: new Date(parseInt(message.created_at, 10)).toLocaleString() },
        { key: 'event', element: (
          <L.p fontSize="small">
            <strong>{ message.event_name || message.event_slug || 'Unknown Event' }</strong>
          </L.p>
        ) },
        { key: 'message', element: (
          <Box fontSize="small">
            { MarkdownMui.compiler(message.message_text || message.short_message || '') }
          </Box>
        ) },
      ],
    })) || [];
  }, [ eventMessagesData?.messages ]);

  const activationControls = useMemo(() => (
    <Stack spacing={ 1 }>
      <L.p color="textSecondary" fontSize="small">
        Select the wait time before auto-starting quests.
      </L.p>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel id="auto-start-quests-wait-mode-label">Wait Hours</InputLabel>
        <Select
          labelId="auto-start-quests-wait-mode-label"
          id="auto-start-quests-wait-mode"
          value={ waitMode }
          label="Wait Hours"
          onChange={ ({ target }) => setWaitMode(String(target.value)) }
        >
          <MenuItem value="3">3</MenuItem>
          <MenuItem value="24">24</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  ), [ waitMode ]);

  const isLoading = isLoadingHabitica || isActivating || isRefreshing || isDeactivating;
  const totalMessagesPages = eventMessagesData?.pagination?.totalPages || 1;

  return (
    <>
      <PageHead title="Auto Start Quests" />

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
          <Stack spacing={ 4 }>
            <L.h1 align="center" color="text.softBlack">
              Auto Start Quests
            </L.h1>

            <ToolCockpit
              habiticaData={ habiticaData }
              toolInstance={ activeToolInstance }
              isLoading={ isLoading }
              openConfirmation={ openConfirmation }
              activationControls={ activationControls }
              returnPath="/tools/auto-start-quests"
              onActivate={ handleActivate }
              onRefresh={ handleRefresh }
              onDeactivate={ handleDeactivate }
            />

            <L.section>
              <MarkdownMui.Markdown>
                { toolDescriptionContent }
              </MarkdownMui.Markdown>
            </L.section>

            <L.section>
              <Accordion
                expanded={ expandedAccordion === 'advanced' }
                onChange={ (e, isExpanded) => setExpandedAccordion(isExpanded ? 'advanced' : false) }
              >
                <AccordionSummary
                  expandIcon={ <ExpandMoreIcon /> }
                  aria-controls="advanced-details"
                  id="advanced-details-header"
                >
                  <L.h3 sx={{ m: 0 }}>The Technical Details</L.h3>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                  <MarkdownMui.Markdown>
                    { advancedDetailsContent }
                  </MarkdownMui.Markdown>
                </AccordionDetails>
              </Accordion>
            </L.section>

            <L.section>
              <VirtualizedTableSimple
                size="small"
                height={{ xxs: '40vh', sm: '50vh', md: '55vh' }}
                isLoading={ isLoadingMessages }
                title="Event History"
                subtitle={ (
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
                      disabled={ totalMessagesPages <= 1 || currentMessagesPage === 1 }
                      onClick={ () => setCurrentMessagesPage(currentMessagesPage - 1) }
                    />
                    <L.p sx={{ color: 'text.white', userSelect: 'none' }}>{ currentMessagesPage }</L.p>
                    <SquareIconButton
                      aria-label="Next list of notifications"
                      color="secondary"
                      variant="contained"
                      icon={ <ArrowForwardIosIcon /> }
                      disabled={ totalMessagesPages <= 1 || currentMessagesPage >= totalMessagesPages }
                      onClick={ () => setCurrentMessagesPage(currentMessagesPage + 1) }
                    />
                  </Stack>
                ) }
                noDataMessage={ activeToolInstance ? 'No events recorded yet' : 'Activate the tool to see event history.' }
                headers={ [
                  { label: 'Time', key: 'timestamp', width: '5rem' },
                  { label: 'Event', key: 'event', width: '6rem' },
                  { label: 'Message', key: 'message', width: '15rem' },
                ] }
                rows={ memoizedMessageRows }
              />
            </L.section>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default AutoStartQuestsPage;
