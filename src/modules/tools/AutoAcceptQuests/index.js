import React, { useState, useCallback, useMemo } from 'react';
import {
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PageHead, L, MarkdownMui } from 'components';
import { usePageManager } from 'lib/hooks';
import {
  useApiGetHabitica,
  useMutateInitiateAutoAcceptQuests,
  useMutateRefreshTool,
  useMutateTeardownTool,
} from 'lib/api/methods/habiticaApi';
import { ToolCockpit, ToolEventMessagesTable } from '../components';
import toolDescriptionContent from './content/toolDescription.md';
import advancedDetailsContent from './content/advancedTechnicalDetails.md';


const TOOL_SLUG = 'auto-accept-quests';

const AutoAcceptQuestsPage = () => {
  const [ expandedAccordion, setExpandedAccordion ] = useState(false);

  const { data: habiticaData, isLoading: isLoadingHabitica, error: habiticaError, isEnabled: isEnabledHabitica } = useApiGetHabitica();

  // Find the active auto-accept-quests tool instance
  const activeToolInstance = useMemo(() => {
    if (!habiticaData?.habitica_tools) { return null; }
    const tools = habiticaData.habitica_tools.filter(
      t => t.tool_slug === TOOL_SLUG,
    );
    return tools.length > 0 ? tools[0] : null;
  }, [ habiticaData?.habitica_tools ]);

  // Mutations
  const { mutate: mutateActivate, isPending: isActivating, error: activationError } = useMutateInitiateAutoAcceptQuests();
  const { mutate: mutateRefresh, isPending: isRefreshing, error: refreshError } = useMutateRefreshTool();
  const { mutate: mutateTeardown, isPending: isDeactivating, error: deactivationError } = useMutateTeardownTool();

  const {
    openConfirmation,
  } = usePageManager({
    defaultHandleApiError: {
      returnPath: '/tools/auto-accept-quests',
      handledErrors: [ 'HABITICA_USER_NOT_FOUND' ],
    },
    defaultRoutingPath: '/tools/auto-accept-quests',
    defaultPageStage: 'loading',
    apiIsLoading: isLoadingHabitica,
    apiErrors: habiticaError || activationError || refreshError || deactivationError,
  });

  // Handlers for ToolCockpit
  const handleActivate = useCallback(() => {
    mutateActivate(undefined, {
      onSuccess: () => {
        openConfirmation?.({
          title: 'Tool Activated',
          content: 'Auto Accept Quests is active. Quest invitations will be accepted automatically.',
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
            content: 'Auto Accept Quests is inactive.',
            primaryButtonText: 'Got it',
            removeSecondaryAction: true,
          });
        },
      });
    }
  }, [ activeToolInstance?.id, mutateTeardown, openConfirmation ]);

  const isLoading = isLoadingHabitica || isActivating || isRefreshing || isDeactivating;

  return (
    <>
      <PageHead title="Auto Accept Quests" />
      
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
              isLoading={ isLoading }
              skipInitialLoading={ isEnabledHabitica }
              openConfirmation={ openConfirmation }
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
              <ToolEventMessagesTable
                activeToolInstance={ activeToolInstance }
                toolSlug={ TOOL_SLUG }
              />
            </L.section>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default AutoAcceptQuestsPage;
