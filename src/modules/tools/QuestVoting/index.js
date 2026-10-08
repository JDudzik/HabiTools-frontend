import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PageHead, L, MarkdownMui } from 'components';
import { usePageManager } from 'lib/hooks';
import {
  useApiGetHabitica,
  useApiGetQuestVotingState,
  useMutateInitiateQuestVoting,
  useMutateEditQuestVoting,
  useMutateDisableQuestVoting,
  useMutatePauseQuestVoting,
  useMutateUnpauseQuestVoting,
  useMutateRefreshTool,
} from 'lib/api/methods/habiticaApi';
import { ToolCockpit, ToolEventMessagesTable } from '../components';
import toolDescriptionContent from './content/toolDescription.md';
import advancedDetailsContent from './content/advancedTechnicalDetails.md';


const TOOL_SLUG = 'quest-voting';

const FILTER_OPTIONS = [
  { value: 'normal', label: 'Normal (gold, unlockable, world)' },
  { value: 'pets', label: 'Pets (pet, hatchingPotion)' },
  { value: 'time-traveler', label: 'Time Traveler (timeTravelers)' },
];

const normalizeFilters = (filters) => {
  if (!Array.isArray(filters) || filters.length === 0) {
    return [ 'normal', 'pets', 'time-traveler' ];
  }

  return filters.filter(item => FILTER_OPTIONS.some(option => option.value === item));
};

const QuestVotingPage = () => {
  const [ expandedAccordion, setExpandedAccordion ] = useState('description');
  const [ filterCategories, setFilterCategories ] = useState([ 'normal', 'pets', 'time-traveler' ]);
  const [ leaveOnePerQuest, setLeaveOnePerQuest ] = useState(false);
  const [ partyWideFilter, setPartyWideFilter ] = useState('all');
  const [ secureVoting, setSecureVoting ] = useState(true);

  const { data: habiticaData, isLoading: isLoadingHabitica, error: habiticaError, isEnabled: isEnabledHabitica } = useApiGetHabitica();
  const { data: questVotingState, isLoading: isLoadingQuestVoting, error: questVotingError } = useApiGetQuestVotingState();

  const activeToolInstance = useMemo(() => {
    if (!habiticaData?.habitica_tools) { return null; }
    const tools = habiticaData.habitica_tools.filter(tool => tool.tool_slug === TOOL_SLUG);
    return tools.length > 0 ? tools[0] : null;
  }, [ habiticaData?.habitica_tools ]);

  const questVoting = questVotingState?.questVoting || null;
  const isPartyLeaderForTool = questVotingState?.isLeader || false;
  const isToolActive = !!activeToolInstance;

  const { mutate: mutateActivate, isPending: isActivating, error: activationError } = useMutateInitiateQuestVoting();
  const { mutate: mutateEdit, isPending: isEditing, error: editError } = useMutateEditQuestVoting();
  const { mutate: mutateDisable, isPending: isDisabling, error: disableError } = useMutateDisableQuestVoting();
  const { mutate: mutatePause, isPending: isPausing, error: pauseError } = useMutatePauseQuestVoting();
  const { mutate: mutateUnpause, isPending: isUnpausing, error: unpauseError } = useMutateUnpauseQuestVoting();
  const { mutate: mutateRefresh, isPending: isRefreshing, error: refreshError } = useMutateRefreshTool();

  const isFormDirty = useMemo(() => {
    return (
      JSON.stringify(filterCategories) !== JSON.stringify(normalizeFilters(activeToolInstance?.data?.filterCategories)) ||
      leaveOnePerQuest !== !!activeToolInstance?.data?.leaveOnePerQuest ||
      partyWideFilter !== (questVoting?.party_filters?.partyWideFilter || 'all') ||
      secureVoting !== (questVoting?.secure_voting !== false)
    );
  }, [
    filterCategories,
    leaveOnePerQuest,
    partyWideFilter,
    secureVoting,
    activeToolInstance?.data,
    questVoting?.party_filters?.partyWideFilter,
    questVoting?.secure_voting,
  ]);

  const {
    openConfirmation,
  } = usePageManager({
    defaultHandleApiError: {
      returnPath: '/tools/quest-voting',
      handledErrors: [ 'HABITICA_USER_NOT_FOUND' ],
    },
    defaultRoutingPath: '/tools/quest-voting',
    defaultPageStage: 'loading',
    apiIsLoading: isLoadingHabitica || isLoadingQuestVoting,
    apiErrors: habiticaError || questVotingError || activationError || editError || disableError || pauseError || unpauseError || refreshError,
  });

  useEffect(() => {
    const toolData = activeToolInstance?.data || {};
    setFilterCategories(normalizeFilters(toolData?.filterCategories));
    setLeaveOnePerQuest(!!toolData?.leaveOnePerQuest);
  }, [ activeToolInstance?.data ]);

  useEffect(() => {
    if (!questVoting) { return; }

    setPartyWideFilter(questVoting?.party_filters?.partyWideFilter || 'all');
    setSecureVoting(questVoting?.secure_voting !== false);
  }, [ questVoting ]);

  const handleActivate = useCallback(() => {
    mutateActivate({
      filterCategories,
      leaveOnePerQuest,
      partyWideFilter,
      secureVoting,
    }, {
      onSuccess: (response) => {
        const waitingForLeader = response?.waitingForLeader;
        openConfirmation?.({
          title: 'Quest Voting Activated',
          content: waitingForLeader
            ? 'Your settings are saved. The party leader still needs to enable Quest Voting before party-wide automation can run.'
            : 'Quest Voting is active for your account.',
          primaryButtonText: 'Got it',
          removeSecondaryAction: true,
        });
      },
    });
  }, [ filterCategories, leaveOnePerQuest, mutateActivate, openConfirmation, partyWideFilter, secureVoting ]);

  const handleSaveSettings = useCallback(() => {
    mutateEdit({
      filterCategories,
      leaveOnePerQuest,
      ...(isPartyLeaderForTool ? { partyWideFilter, secureVoting } : {}),
    }, {
      onSuccess: () => {
        openConfirmation?.({
          title: 'Saved',
          content: 'Quest Voting settings were updated.',
          primaryButtonText: 'Done',
          removeSecondaryAction: true,
        });
      },
    });
  }, [ filterCategories, isPartyLeaderForTool, leaveOnePerQuest, mutateEdit, openConfirmation, partyWideFilter, secureVoting ]);

  const handleDeactivate = useCallback(() => {
    mutateDisable(undefined, {
      onSuccess: () => {
        openConfirmation?.({
          title: 'Quest Voting Disabled',
          content: 'Your Quest Voting instance has been disabled.',
          primaryButtonText: 'Done',
          removeSecondaryAction: true,
        });
      },
    });
  }, [ mutateDisable, openConfirmation ]);

  const handleRefresh = useCallback(() => {
    if (!activeToolInstance?.id) { return; }

    mutateRefresh({
      resourceId: activeToolInstance.id,
    });
  }, [ activeToolInstance?.id, mutateRefresh ]);

  const handlePauseToggle = useCallback(() => {
    if (!isPartyLeaderForTool || !questVoting) { return; }

    if (questVoting.paused) {
      mutateUnpause(undefined, {
        onSuccess: () => {
          openConfirmation?.({
            title: 'Quest Voting Unpaused',
            content: 'Quest Voting is active again and the ballot has resumed.',
            primaryButtonText: 'Done',
            removeSecondaryAction: true,
          });
        },
      });
      return;
    }

    mutatePause(undefined, {
      onSuccess: () => {
        openConfirmation?.({
          title: 'Quest Voting Paused',
          content: 'Quest Voting is paused until the party leader unpauses it.',
          primaryButtonText: 'Done',
          removeSecondaryAction: true,
        });
      },
    });
  }, [ isPartyLeaderForTool, mutatePause, mutateUnpause, openConfirmation, questVoting ]);

  const roster = useMemo(() => {
    return (questVoting?.participants || []).map((participant) => {
      return {
        key: participant?.userId || participant?.habiticaUserId,
        label: participant?.displayName || participant?.username || 'Unknown user',
      };
    });
  }, [ questVoting?.participants ]);

  const eventResourceInstance = useMemo(() => {
    if (!questVoting?.id) { return null; }
    return { id: questVoting.id };
  }, [ questVoting?.id ]);

  const isLoading = isLoadingHabitica || isLoadingQuestVoting || isActivating || isEditing || isDisabling || isRefreshing || isPausing || isUnpausing;

  const controls = (
    <Stack spacing={ 2 } width="100%">
      <FormControl fullWidth size="small">
        <InputLabel id="quest-voting-filter-categories-label">My Allowed Categories</InputLabel>
        <Select
          multiple
          labelId="quest-voting-filter-categories-label"
          id="quest-voting-filter-categories"
          value={ filterCategories }
          label="My Allowed Categories"
          onChange={ ({ target }) => setFilterCategories(normalizeFilters(target.value)) }
        >
          {FILTER_OPTIONS.map(option => (
            <MenuItem key={ option.value } value={ option.value }>{ option.label }</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormGroup>
        <FormControlLabel
          control={ <Checkbox checked={ leaveOnePerQuest } onChange={ e => setLeaveOnePerQuest(e.target.checked) } /> }
          label="Always keep 1 copy of each quest in my inventory"
        />
      </FormGroup>

      {isPartyLeaderForTool && (
        <>
          <FormControl fullWidth size="small">
            <InputLabel id="quest-voting-party-filter-label">Party-Wide Filter</InputLabel>
            <Select
              labelId="quest-voting-party-filter-label"
              id="quest-voting-party-filter"
              value={ partyWideFilter }
              label="Party-Wide Filter"
              onChange={ ({ target }) => setPartyWideFilter(target.value) }
            >
              <MenuItem value="all">All Quests</MenuItem>
              <MenuItem value="pets-only">Pets Only</MenuItem>
            </Select>
          </FormControl>

          <FormGroup>
            <FormControlLabel
              control={ <Checkbox checked={ secureVoting } onChange={ e => setSecureVoting(e.target.checked) } /> }
              label="Secure voting mode (must be logged in and in-party)"
            />
          </FormGroup>

          <Stack direction="row" spacing={ 1 }>
            <Button
              variant="outlined"
              color={ questVoting?.paused ? 'success' : 'warning' }
              disabled={ isFormDirty }
              onClick={ handlePauseToggle }
            >
              {questVoting?.paused ? 'Unpause' : 'Pause'}
            </Button>
            {isFormDirty && (
              <L.p color="info">
                You have unsaved changes. You cannot {questVoting?.paused ? 'unpause' : 'pause'} until you save your changes.
              </L.p>
            )}
          </Stack>
        </>
      )}
    </Stack>
  );

  return (
    <>
      <PageHead title="Quest Voting" />

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
          maxWidth="62em"
          direction={{ xxs: 'column-reverse', md: 'row-reverse' }}
          alignItems="start"
          textAlign={{ xxs: 'center', md: 'left' }}
        >
          <Stack spacing={ 4 } width="100%">
            <L.h1 align="center" color="text.softBlack">
              Quest Voting
            </L.h1>

            <ToolCockpit
              habiticaData={ habiticaData }
              toolInstance={ activeToolInstance }
              isLoading={ isLoading }
              skipInitialLoading={ isEnabledHabitica }
              openConfirmation={ openConfirmation }
              controlSlots={{
                pre: controls,
                post: controls,
                postSave: handleSaveSettings,
                postIsSaveDisable: isEditing || !isFormDirty,
              }}
              returnPath="/tools/quest-voting"
              onActivate={ handleActivate }
              onRefresh={ handleRefresh }
              onDeactivate={ handleDeactivate }
            />

            {!questVoting?.leader_user_id && isToolActive && (
              <L.section>
                <L.p color="warning.dark">
                  You are set up, but the party leader still needs to enable Quest Voting before ballots can run automatically.
                </L.p>
              </L.section>
            )}

            <L.section>
              <Accordion
                expanded={ expandedAccordion === 'description' }
                onChange={ (e, isExpanded) => setExpandedAccordion(isExpanded ? 'description' : false) }
              >
                <AccordionSummary
                  expandIcon={ <ExpandMoreIcon /> }
                  aria-controls="description-details"
                  id="description-details-header"
                >
                  <L.h3 sx={{ m: 0 }}>Tool Description</L.h3>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                  <MarkdownMui.Markdown>{ toolDescriptionContent }</MarkdownMui.Markdown>
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
                  <MarkdownMui.Markdown>{ advancedDetailsContent }</MarkdownMui.Markdown>
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
                    activeToolInstance={ eventResourceInstance }
                    toolSlug={ TOOL_SLUG }
                  />
                </AccordionDetails>
              </Accordion>
            </L.section>

            <L.section>
              <Stack spacing={ 1.5 }>
                <L.h3 sx={{ m: 0 }}>Current Participant Roster</L.h3>
                {roster.length === 0 && <L.p>No participants are currently in the roster.</L.p>}
                {roster.map(member => (
                  <L.p key={ member.key }>{ member.label }</L.p>
                ))}
              </Stack>
            </L.section>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default QuestVotingPage;
