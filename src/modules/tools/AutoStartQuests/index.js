import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PageHead, L, MarkdownMui } from 'components';
import { usePageManager } from 'lib/hooks';
import {
  useApiGetHabitica,
  useMutateInitiateAutoStartQuests,
  useMutateEditAutoStartQuests,
  useMutateRefreshTool,
  useMutateTeardownTool,
} from 'lib/api/methods/habiticaApi';
import { ToolCockpit, ToolEventMessagesTable } from '../components';
import toolDescriptionContent from './content/toolDescription.md';
import toolHoursDescriptionContent from './content/toolHoursDescription.md';
import advancedDetailsContent from './content/advancedTechnicalDetails.md';


const TOOL_SLUG = 'auto-start-quests';

const AutoStartQuestsPage = () => {
  const [ expandedAccordion, setExpandedAccordion ] = useState(false);
  const [ waitHours, setWaitHours ] = useState(24);

  const { data: habiticaData, isLoading: isLoadingHabitica, error: habiticaError, isEnabled: isEnabledHabitica } = useApiGetHabitica();

  const activeToolInstance = useMemo(() => {
    if (!habiticaData?.habitica_tools) { return null; }
    const tools = habiticaData.habitica_tools.filter(tool => tool.tool_slug === TOOL_SLUG);
    return tools.length > 0 ? tools[0] : null;
  }, [ habiticaData?.habitica_tools ]);

  const { mutate: mutateActivate, isPending: isActivating, error: activationError } = useMutateInitiateAutoStartQuests();
  const { mutate: mutateEdit, isPending: isEditing, error: editError } = useMutateEditAutoStartQuests();
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
    apiErrors: habiticaError || activationError || editError || refreshError || deactivationError,
  });

  useEffect(() => {
    if (activeToolInstance?.data?.waitHours !== undefined) {
      setWaitHours(activeToolInstance.data.waitHours);
    }
  }, [ activeToolInstance?.data?.waitHours ]);

  const handleActivate = useCallback(() => {
    mutateActivate({
      waitHours,
    }, {
      onSuccess: () => {
        openConfirmation?.({
          title: 'Tool Activated',
          content: `Auto Start Quests is now active. Quests will start after waiting for ${ waitHours } hour${ waitHours === 1 ? '' : 's' }.`,
          primaryButtonText: 'Got it',
          removeSecondaryAction: true,
        });
      },
    });
  }, [ mutateActivate, openConfirmation, waitHours ]);

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
            content: 'Auto Start Quests is inactive.',
            primaryButtonText: 'Got it',
            removeSecondaryAction: true,
          });
        },
      });
    }
  }, [ activeToolInstance?.id, mutateTeardown, openConfirmation ]);

  const handleEditSave = useCallback(() => mutateEdit({
    resourceId: activeToolInstance.id,
    waitHours,
  }, {
    onSuccess: () => {
      openConfirmation?.({
        title: 'Settings Saved',
        content: `Quest auto-start delay updated to ${ waitHours } hour${ waitHours === 1 ? '' : 's' }.`,
        primaryButtonText: 'Got it',
        removeSecondaryAction: true,
      });
    },
  }), [ activeToolInstance?.id, mutateEdit, openConfirmation, waitHours ]);

  const activationControls = useMemo(() => (
    <Stack spacing={ 1 }>
      <L.p color="textSecondary" fontSize="small">
        How long should quests wait before starting?
      </L.p>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel id="auto-start-quests-wait-mode-label">Hours</InputLabel>
        <Select
          labelId="auto-start-quests-wait-mode-label"
          id="auto-start-quests-wait-mode"
          value={ waitHours }
          label="Hours"
          onChange={ ({ target }) => setWaitHours(Number(target.value)) }
        >
          <MenuItem value={ 24 }>24 Hours</MenuItem>
          <MenuItem value={ 12 }>12 Hours</MenuItem>
          <MenuItem value={ 3 }>3 Hours</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  ), [ waitHours ]);

  const isLoading = isLoadingHabitica || isActivating || isEditing || isRefreshing || isDeactivating;

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
              skipInitialLoading={ isEnabledHabitica }
              openConfirmation={ openConfirmation }
              controlSlots={{
                pre: activationControls,
                post: activationControls,
                postSave: handleEditSave,
                postIsSaveDisable: isEditing || activeToolInstance?.data?.waitHours === waitHours,
              }}
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
                expanded={ expandedAccordion === 'hours-description' }
                onChange={ (e, isExpanded) => setExpandedAccordion(isExpanded ? 'hours-description' : false) }
              >
                <AccordionSummary
                  expandIcon={ <ExpandMoreIcon /> }
                  aria-controls="advanced-details"
                  id="advanced-details-header"
                >
                  <L.h3 sx={{ m: 0 }}>Why are the only options 24, 12, or 3 hours?</L.h3>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                  <MarkdownMui.Markdown>
                    { toolHoursDescriptionContent }
                  </MarkdownMui.Markdown>
                </AccordionDetails>
              </Accordion>
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

export default AutoStartQuestsPage;
