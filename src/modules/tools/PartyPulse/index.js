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
  useMutateEditPartyPulse,
  useMutateInitiatePartyPulse,
  useMutateRefreshTool,
  useMutateTeardownTool,
} from 'lib/api/methods/habiticaApi';
import { ToolCockpit, ToolEventMessagesTable } from '../components';
import { PartyPulseMemberCard } from './components';
import toolDescriptionContent from './content/toolDescription.md';
import advancedDetailsContent from './content/advancedTechnicalDetails.md';


const TOOL_SLUG = 'party-pulse';

const SCORE_DIRECTIONS = {
  ascending: 'Ascending (Lowest to Highest)',
  descending: 'Descending (Highest to Lowest)',
};

const TIER_DISPLAY = {
  calibrating: {
    label: 'Calibrating',
    backgroundColor: 'misc.ignoredBackground',
    textColor: 'text.black',
  },
  '3': {
    label: 'Paragon',
    backgroundColor: 'habitica.blue50',
    textColor: 'text.black',
  },
  '2': {
    label: 'Active',
    backgroundColor: 'habitica.teal100',
    textColor: 'text.black',
  },
  '1': {
    label: 'Passive',
    backgroundColor: 'habitica.green100',
    textColor: 'text.black',
  },
  '0': {
    label: 'Coasting',
    backgroundColor: 'habitica.yellow100',
    textColor: 'text.black',
  },
  '-1': {
    label: 'Slowing',
    backgroundColor: 'habitica.orange100',
    textColor: 'text.black',
  },
  '-2': {
    label: 'Disengaged',
    backgroundColor: 'habitica.red100',
    textColor: 'text.black',
  },
  '-3': {
    label: 'Dormant',
    backgroundColor: 'habitica.maroon100',
    textColor: 'text.white',
  },
};

const normalizeScoreDirection = value => (value === 'descending' ? 'descending' : 'ascending');

const PartyPulsePage = () => {
  const [ expandedAccordion, setExpandedAccordion ] = useState(false);
  const [ selectedDisplayDirection, setSelectedDisplayDirection ] = useState('ascending');

  const { data: habiticaData, isLoading: isLoadingHabitica, error: habiticaError, isEnabled: isEnabledHabitica } = useApiGetHabitica();

  const activeToolInstance = useMemo(() => {
    if (!habiticaData?.habitica_tools) { return null; }
    const tools = habiticaData.habitica_tools.filter(tool => tool.tool_slug === TOOL_SLUG);
    return tools.length > 0 ? tools[0] : null;
  }, [ habiticaData?.habitica_tools ]);

  const { mutate: mutateActivate, isPending: isActivating, error: activationError } = useMutateInitiatePartyPulse();
  const { mutate: mutateEdit, isPending: isEditing, error: editError } = useMutateEditPartyPulse();
  const { mutate: mutateRefresh, isPending: isRefreshing, error: refreshError } = useMutateRefreshTool();
  const { mutate: mutateTeardown, isPending: isDeactivating, error: deactivationError } = useMutateTeardownTool();

  const {
    openConfirmation,
  } = usePageManager({
    defaultHandleApiError: {
      returnPath: '/tools/party-pulse',
      handledErrors: [ 'HABITICA_USER_NOT_FOUND' ],
    },
    defaultRoutingPath: '/tools/party-pulse',
    defaultPageStage: 'loading',
    apiIsLoading: isLoadingHabitica,
    apiErrors: habiticaError || activationError || editError || refreshError || deactivationError,
  });

  useEffect(() => {
    const scoreDisplayDirection = activeToolInstance?.data?.scoreDisplayDirection;
    if (!scoreDisplayDirection) { return; }
    setSelectedDisplayDirection(normalizeScoreDirection(scoreDisplayDirection));
  }, [ activeToolInstance?.data?.scoreDisplayDirection ]);

  const handleActivate = useCallback(() => {
    mutateActivate(undefined, {
      onSuccess: () => {
        openConfirmation?.({
          title: 'Tool Activated',
          content: 'Party Pulse is active.',
          primaryButtonText: 'Got it',
          removeSecondaryAction: true,
        });
      },
    });
  }, [ mutateActivate, openConfirmation ]);

  const handleRefresh = useCallback(() => {
    mutateRefresh({
      resourceId: activeToolInstance.id,
    });
  }, [ activeToolInstance?.id, mutateRefresh ]);

  const handleDeactivate = useCallback(() => {
    mutateTeardown({
      resourceId: activeToolInstance.id,
    }, {
      onSuccess: () => {
        openConfirmation?.({
          title: 'Tool Deactivated',
          content: 'Party Pulse is inactive.',
          primaryButtonText: 'Got it',
          removeSecondaryAction: true,
        });
      },
    });
  }, [ activeToolInstance?.id, mutateTeardown, openConfirmation ]);

  const handleChangeDisplayDirection = useCallback((newDirection) => {
    const normalizedDirection = normalizeScoreDirection(newDirection);
    const previousDirection = normalizeScoreDirection(selectedDisplayDirection);

    if (!activeToolInstance?.id || normalizedDirection === previousDirection) { return; }

    setSelectedDisplayDirection(normalizedDirection);

    mutateEdit({
      resourceId: activeToolInstance.id,
      scoreDisplayDirection: normalizedDirection,
    }, {
      onError: () => {
        setSelectedDisplayDirection(previousDirection);
      },
    });
  }, [ activeToolInstance?.id, mutateEdit, selectedDisplayDirection ]);

  const scoreDisplayDirection = normalizeScoreDirection(selectedDisplayDirection);

  const sortedMembers = useMemo(() => {
    const rawMembers = activeToolInstance?.data?.members || {};
    const memberList = Object.values(rawMembers).filter(Boolean);

    return memberList.sort((a, b) => {
      const scoreA = Number(a?.currentScore || 0);
      const scoreB = Number(b?.currentScore || 0);
      if (scoreA !== scoreB) {
        return scoreDisplayDirection === 'ascending' ? scoreA - scoreB : scoreB - scoreA;
      }

      const nameA = String(a?.displayName || a?.username || '').toLowerCase();
      const nameB = String(b?.displayName || b?.username || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [ activeToolInstance?.data?.members, scoreDisplayDirection ]);

  const cockpitControls = useMemo(() => (
    <Stack spacing={ 1 }>
      <L.p color="textSecondary" fontSize="small">
        Display Order
      </L.p>
      <FormControl size="small" sx={{ minWidth: 280 }}>
        <InputLabel id="party-pulse-display-order-label">Score Direction</InputLabel>
        <Select
          labelId="party-pulse-display-order-label"
          id="party-pulse-display-order"
          value={ selectedDisplayDirection }
          label="Score Direction"
          disabled={ isEditing }
          onChange={ ({ target }) => handleChangeDisplayDirection(target.value) }
        >
          <MenuItem value="ascending">{ SCORE_DIRECTIONS.ascending }</MenuItem>
          <MenuItem value="descending">{ SCORE_DIRECTIONS.descending }</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  ), [ handleChangeDisplayDirection, isEditing, selectedDisplayDirection ]);

  const isLoading = isLoadingHabitica || isActivating || isRefreshing || isDeactivating;
  const isToolActive = !!activeToolInstance && (activeToolInstance.expires_at === null || activeToolInstance.expires_at > Date.now());

  return (
    <>
      <PageHead title="Party Pulse" />

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
              Party Pulse
            </L.h1>

            <ToolCockpit
              habiticaData={ habiticaData }
              toolInstance={ activeToolInstance }
              isLoading={ isLoading }
              skipInitialLoading={ isEnabledHabitica }
              openConfirmation={ openConfirmation }
              controlSlots={{
                post: cockpitControls,
                postHideSaveButton: true,
              }}
              returnPath="/tools/party-pulse"
              onActivate={ handleActivate }
              onRefresh={ handleRefresh }
              onDeactivate={ handleDeactivate }
            />

            {isToolActive && (
              <L.section>
                <Stack spacing={ 2 }>
                  <L.h3 sx={{ m: 0 }}>
                    Party Pulse Scores ({ sortedMembers.length } members)
                  </L.h3>

                  {sortedMembers.length === 0 && (
                    <L.p>
                      No party member score data is available yet. Trigger a refresh after the next pulse check.
                    </L.p>
                  )}

                  {sortedMembers.map((member) => {
                    const totalChecks = member?.totalChecks ?? 0;
                    const scoreTier = member?.scoreTier ?? 0;
                    const tier = TIER_DISPLAY[scoreTier];
                    const displayName = member?.displayName || member?.username || '(unknown)';

                    return (
                      <PartyPulseMemberCard
                        key={ member.id }
                        member={ member }
                        tier={ tier }
                        displayName={ displayName }
                        totalChecks={ totalChecks }
                      />
                    );
                  })}
                </Stack>
              </L.section>
            )}

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
              <Accordion
                expanded={ expandedAccordion === 'events' }
                onChange={ (e, isExpanded) => setExpandedAccordion(isExpanded ? 'events' : false) }
              >
                <AccordionSummary
                  expandIcon={ <ExpandMoreIcon /> }
                  aria-controls="events-details"
                  id="events-details-header"
                >
                  <L.h3 sx={{ m: 0 }}>Event Messages</L.h3>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                  <ToolEventMessagesTable
                    activeToolInstance={ activeToolInstance }
                    toolSlug={ TOOL_SLUG }
                  />
                </AccordionDetails>
              </Accordion>
            </L.section>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default PartyPulsePage;
