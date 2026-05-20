import React, { useContext, useState, useCallback, useMemo } from 'react';
import {
  Stack,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PageHead, L, VirtualizedTableSimple, MarkdownMui, SquareIconButton } from 'components';
import { usePageManager } from 'lib/hooks';
import { userContext } from 'lib/contexts/UserContext';
import {
  useApiGetHabitica,
  useMutateInitiateAutoAcceptQuests,
  useMutateRefreshTool,
  useMutateTeardownTool,
} from 'lib/api/methods/habiticaApi';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useApiListEventMessages } from 'lib/api/methods/eventMessageApi';
import { ToolCockpit } from '../components/ToolCockpit';
import toolDescriptionContent from './content/toolDescription.md';
import advancedDetailsContent from './content/advancedTechnicalDetails.md';

const TOOL_SLUG = 'auto-accept-quests';


const AutoAcceptQuestsPage = () => {
  const { userState } = useContext(userContext);
  const [ expandedAccordion, setExpandedAccordion ] = useState(false);
  const [ currentMessagesPage, setCurrentMessagesPage ] = useState(1);

  // Fetch Habitica data (authenticated users only)
  const { data: habiticaData, isLoading: isLoadingHabitica, error: habiticaError } = useApiGetHabitica({
    enabled: userState?.isLoggedIn,
  });

  // Find the active auto-accept-quests tool instance
  const activeToolInstance = useMemo(() => {
    if (!habiticaData?.habitica_tools) { return null; }
    const tools = habiticaData.habitica_tools.filter(
      t => t.tool_slug === TOOL_SLUG,
    );
    return tools.length > 0 ? tools[0] : null;
  }, [ habiticaData?.habitica_tools ]);

  // Fetch event messages for the active tool
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
      instance: 'auto-accept-quests-messages',
    },
  );

  const {
    openConfirmation,
    pageStage,
  } = usePageManager({
    defaultHandleApiError: {
      returnPath: '/tools/auto-accept-quests',
      handledErrors: [],
    },
    defaultRoutingPath: '/tools/auto-accept-quests',
    defaultPageStage: 'loading',
    apiIsLoading: !userState?.isLoggedIn || isLoadingHabitica,
    apiErrors: habiticaError || messagesError,
  });


  // Mutations
  const { mutate: mutateActivate, isPending: isActivating } = useMutateInitiateAutoAcceptQuests();
  const { mutate: mutateRefresh, isPending: isRefreshing } = useMutateRefreshTool();
  const { mutate: mutateTeardown, isPending: isDeactivating } = useMutateTeardownTool();


  // Handlers for ToolCockpit
  const handleActivate = useCallback(() => {
    mutateActivate(undefined, {
      onSuccess: () => {
        openConfirmation?.({
          title: 'Tool Activated',
          content: 'Auto Accept Quests is now active. Quest invitations will be accepted automatically.',
          primaryButtonText: 'Got it',
          removeSecondaryAction: true,
        });
      },
    });
  }, [ mutateActivate, openConfirmation ]);

  const handleRefresh = useCallback(() => {
    if (activeToolInstance?.id) {
      mutateRefresh({
        resourceId: activeToolInstance.id,
      }, {
        onSuccess: () => {
          openConfirmation?.({
            title: 'Tool Refreshed',
            content: 'Your tool lease has been extended for another 30 days.',
            primaryButtonText: 'Got it',
            removeSecondaryAction: true,
          });
        },
      });
    }
  }, [ activeToolInstance?.id, mutateRefresh, openConfirmation ]);

  const handleDeactivate = useCallback(() => {
    if (activeToolInstance?.id) {
      mutateTeardown({
        resourceId: activeToolInstance.id,
      }, {
        onSuccess: () => {
          openConfirmation?.({
            title: 'Tool Deactivated',
            content: 'Auto Accept Quests is now inactive. You can reactivate anytime.',
            primaryButtonText: 'Got it',
            removeSecondaryAction: true,
          });
        },
      });
    }
  }, [ activeToolInstance?.id, mutateTeardown, openConfirmation ]);

  // Format event message table rows
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

  const isLoading = isLoadingHabitica || isActivating || isRefreshing || isDeactivating;

  return (
    <>
      <PageHead title="Auto Accept Quests" />

      {pageStage === 'loading' && null}

      {pageStage === 'main' && (
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
                Auto Accept Quests
              </L.h1>

              <ToolCockpit
                habiticaData={ habiticaData }
                toolInstance={ activeToolInstance }
                toolSlug={ TOOL_SLUG }
                openConfirmation={ openConfirmation }
                isLoading={ isLoading }
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

              {userState?.isLoggedIn && (
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
                          disabled={ eventMessagesData?.pagination?.totalPages <= 1 || currentMessagesPage === 1 }
                          onClick={ () => setCurrentMessagesPage(currentMessagesPage - 1) }
                        />
                        <L.p sx={{ color: 'text.white', userSelect: 'none' }}>{ currentMessagesPage }</L.p>
                        <SquareIconButton
                          aria-label="Next list of notifications"
                          color="secondary"
                          variant="contained"
                          icon={ <ArrowForwardIosIcon /> }
                          disabled={ eventMessagesData?.pagination?.totalPages <= 1 || currentMessagesPage >= eventMessagesData?.pagination?.totalPages }
                          onClick={ () => setCurrentMessagesPage(currentMessagesPage + 1) }
                        />
                      </Stack>
                    ) }
                    noDataMessage={ activeToolInstance ? 'No events recorded yet' : 'Activate the tool to see event history.' }
                    headers={ [
                      { label: 'Time', key: 'timestamp', width: '7rem' },
                      { label: 'Event', key: 'event', width: '17%' },
                      { label: 'Message', key: 'message' },
                    ] }
                    rows={ memoizedMessageRows }
                  />
                </L.section>
              )}
            </Stack>
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default AutoAcceptQuestsPage;
