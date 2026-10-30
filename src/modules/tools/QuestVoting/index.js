import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
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
  useMutateStartQuestVotingBallot,
  useMutateRefreshTool,
} from 'lib/api/methods/habiticaApi';
import { ToolCockpit, ToolEventMessagesTable } from '../components';
import toolDescriptionContent from './content/toolDescription.md';
import advancedDetailsContent from './content/advancedTechnicalDetails.md';


const TOOL_SLUG = 'quest-voting';

const FILTER_OPTIONS = [
  { value: 'normal', label: 'Mainline' },
  { value: 'pets', label: 'Eggs & Potions' },
  { value: 'time-traveler', label: 'Time Travelers' },
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
  const eventsTableRef = useRef(null);

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
  const { mutate: mutateNewBallot, isPending: isStartingBallot, error: newBallotError } = useMutateStartQuestVotingBallot();
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
    pageError,
  } = usePageManager({
    defaultHandleApiError: {
      returnPath: '/tools/quest-voting',
      handledErrors: [ 'HABITICA_USER_NOT_FOUND', 'HABITICA_PARTY_NOT_FOUND', 'QUEST_VOTING_NOT_IN_PARTY' ],
    },
    defaultRoutingPath: '/tools/quest-voting',
    defaultPageStage: 'loading',
    apiIsLoading: isLoadingHabitica || isLoadingQuestVoting,
    apiErrors: habiticaError
      || questVotingError
      || activationError
      || editError
      || disableError
      || pauseError
      || unpauseError
      || newBallotError
      || refreshError,
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

  const handleNewBallot = useCallback(() => {
    if (!isPartyLeaderForTool || !questVoting) { return; }

    openConfirmation?.({
      title: 'Start New Ballot?',
      content: questVoting?.paused
        ? 'This will abandon the current ballot, unpause Quest Voting, and immediately create a new ballot for the party.'
        : 'This will abandon the current ballot and immediately create a new ballot for the party.',
      primaryButtonText: 'Start New Ballot',
      secondaryButtonText: 'Cancel',
      onRequestSubmit: () => mutateNewBallot(undefined, {
        onSuccess: () => {
          openConfirmation?.({
            title: 'New Ballot Started',
            content: 'The current ballot was abandoned and a new ballot is now open for the party.',
            primaryButtonText: 'Done',
            removeSecondaryAction: true,
          });
          eventsTableRef?.current?.refresh?.();
        },
      }),
    });
  }, [ isPartyLeaderForTool, mutateNewBallot, openConfirmation, questVoting ]);

  const handlePauseToggle = useCallback(() => {
    if (!isPartyLeaderForTool || !questVoting) { return; }

    if (questVoting.paused) {
      openConfirmation?.({
        title: 'Unpause Quest Voting?',
        content: 'This will resume Quest Voting. If your party isn\'t in a quest, the ballot will conclude and launch the quest immediately.',
        primaryButtonText: 'Unpause',
        secondaryButtonText: 'Cancel',
        onRequestSubmit: () => mutateUnpause(undefined, {
          onSuccess: () => {
            openConfirmation?.({
              title: 'Quest Voting Unpaused',
              content: 'Quest Voting has resumed. If your party isn\'t in a quest, the ballot will conclude and launch the quest immediately.',
              primaryButtonText: 'Done',
              removeSecondaryAction: true,
            });
            eventsTableRef?.current?.refresh?.();
          },
        }),
      });
      return;
    }

    openConfirmation?.({
      title: 'Pause Quest Voting?',
      content: 'This will pause Quest Voting. Members can still vote on the current ballot, but it will not conclude until the party leader unpauses.',
      primaryButtonText: 'Pause',
      secondaryButtonText: 'Cancel',
      onRequestSubmit: () => mutatePause(undefined, {
        onSuccess: () => {
          openConfirmation?.({
            title: 'Quest Voting Paused',
            content: 'Quest Voting has paused. Members can still vote on the current ballot, but it will not conclude until the party leader unpauses.',
            primaryButtonText: 'Done',
            removeSecondaryAction: true,
          });
          eventsTableRef?.current?.refresh?.();
        },
      }),
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

  const isLoading = isLoadingHabitica
    || isLoadingQuestVoting
    || isActivating
    || isEditing
    || isDisabling
    || isRefreshing
    || isPausing
    || isUnpausing
    || isStartingBallot;

  const hasPartyError = [ 'HABITICA_PARTY_NOT_FOUND', 'QUEST_VOTING_NOT_IN_PARTY' ].includes(pageError?.status);

  const controls = (
    <Stack spacing={ 4 } width="100%" maxWidth="500px">
      <FormControl fullWidth size="small">
        <InputLabel id="quest-voting-filter-categories-label">My Allowed Quest Categories</InputLabel>
        <Select
          multiple
          labelId="quest-voting-filter-categories-label"
          id="quest-voting-filter-categories"
          value={ filterCategories }
          label="My Allowed Quest Categories"
          onChange={ ({ target }) => setFilterCategories(normalizeFilters(target.value)) }
        >
          {FILTER_OPTIONS.map(option => (
            <MenuItem key={ option.value } value={ option.value }>{ option.label }</MenuItem>
          ))}
        </Select>
        <L.p color="grey">These are the categories of quests from your personal inventory that are allowed to be used for ballots.</L.p>
      </FormControl>

      <FormGroup>
        <FormControlLabel
          control={ <Checkbox checked={ leaveOnePerQuest } onChange={ e => setLeaveOnePerQuest(e.target.checked) } /> }
          label="Keep 1 copy of my quests"
        />
        <L.p color="grey">If enabled, you will always keep 1 copy of each quest in your inventory.</L.p>
      </FormGroup>

      {isPartyLeaderForTool && (
        <>
          <L.h3
            color="text.darkGrey"
            sx={{ borderTop: '1px solid', borderColor: 'divider', paddingTop: 2 }}
          >Party-Leader Controls:</L.h3>
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
            <L.p color="grey">This filter applies to all party members and determines if you only want pet related quests or any type of quest.</L.p>
          </FormControl>

          <Stack>
            <FormGroup>
              <FormControlLabel
                sx={{ margin: 0, padding: 0 }}
                control={ <Checkbox checked={ secureVoting } onChange={ e => setSecureVoting(e.target.checked) } /> }
                label="Secure voting mode"
              />
            </FormGroup>
            <L.p color="grey">Secure voting mode ensures that only logged-in party members can vote.</L.p>
          </Stack>

          <Stack direction="column" spacing={ 1 }>
            {isFormDirty && (
              <L.p color="secondary.veryLight">
                You must save your changes before you can start a new ballot or {questVoting?.paused ? 'unpause' : 'pause'}.
              </L.p>
            )}
            <Stack direction="row" spacing={ 1 }>
              <Button
                sx={{ flex: 1 }}
                variant="outlined"
                color="secondary"
                disabled={ isFormDirty || isStartingBallot || !questVoting }
                onClick={ handleNewBallot }
              >
                New Ballot
              </Button>
              <Button
                sx={{ flex: 1 }}
                variant="outlined"
                color={ questVoting?.paused ? 'success' : 'warning' }
                disabled={ isFormDirty || isPausing || isUnpausing || !questVoting }
                onClick={ handlePauseToggle }
              >
                {questVoting?.paused ? 'Unpause' : 'Pause'}
              </Button>
            </Stack>
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
                post: controls,
                postSave: handleSaveSettings,
                postIsSaveDisable: isEditing || !isFormDirty,
              }}
              returnPath="/tools/quest-voting"
              onActivate={ handleActivate }
              onRefresh={ handleRefresh }
              onDeactivate={ handleDeactivate }
            />

            {hasPartyError && (
              <L.section>
                <L.p color="error" textAlign="center">
                  <b>You must be in a party to use this tool.</b>
                </L.p>
              </L.section>
            )}

            {questVoting && !questVoting?.leader_user_id && isToolActive && (
              <L.section>
                <L.p color="warning.dark">
                  You are set up, but the party leader still needs to enable Quest Voting before ballots can run automatically.
                </L.p>
              </L.section>
            )}

            <MarkdownMui.Markdown>{ toolDescriptionContent }</MarkdownMui.Markdown>

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
                expanded={ expandedAccordion === 'roster' }
                onChange={ (e, isExpanded) => setExpandedAccordion(isExpanded ? 'roster' : false) }
              >
                <AccordionSummary
                  expandIcon={ <ExpandMoreIcon /> }
                  aria-controls="roster-details"
                  id="roster-details-header"
                >
                  <L.h3 sx={{ m: 0 }}>Current Quest Volunteers</L.h3>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2 }}>
                  {roster.length === 0 && <L.p>No volunteers are currently in the roster.</L.p>}
                  {roster.length > 0 && (
                    <L.ul sx={{ textAlign: 'left' }}>
                      {roster.map(member => (
                        <L.li key={ member.key }>{ member.label }</L.li>
                      ))}
                    </L.ul>
                  )}
                </AccordionDetails>
              </Accordion>
            </L.section>

            <ToolEventMessagesTable
              ref={ eventsTableRef }
              activeToolInstance={ eventResourceInstance }
              toolSlug={ TOOL_SLUG }
            />
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default QuestVotingPage;
