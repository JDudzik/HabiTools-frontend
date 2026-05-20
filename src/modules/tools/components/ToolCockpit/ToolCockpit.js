import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  Stack,
  Button,
  CircularProgress,
  IconButton,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { L, HabiticaAccountManagerModal, MarkdownMui, AuthCtaButtons } from 'components';
import { userContext } from 'lib/contexts/UserContext';
import whyExpirationContent from './content/whyExpiration.md';

// const FIVE_MINUTES_MS = 5 * 60 * 1000;
const FIVE_MINUTES_MS = 1000;


/**
 * ToolCockpit: A reusable right-side panel for tool pages showing state-dependent actions.
 * Handles authentication, Habitica linking, tool activation, refresh cooldown, and deactivation.
 * 
 * @param {Object} props
 * @param {Object} [props.toolInstance] - Active tool instance { id, expires_at } or null
 * @param {string} [props.toolSlug] - Slug for localStorage cooldown tracking (e.g., 'auto-accept-quests')
 * @param {Function} [props.onActivate] - Async handler for activate button
 * @param {Function} [props.onRefresh] - Async handler for refresh button
 * @param {Function} [props.onDeactivate] - Async handler for deactivate button
 * @param {Function} [props.openConfirmation] - Modal handler from usePageManager
 * @param {boolean} [props.isLoading] - Global loading state
 */
export const ToolCockpit = ({
  habiticaData,
  toolInstance,
  onActivate,
  onRefresh,
  onDeactivate,
  openConfirmation,
  isLoading,
}) => {
  const { userState } = useContext(userContext);
  const [ habiticaAccountManagerModalOpen, setHabiticaAccountManagerModalOpen ] = useState(false);
  const [ isPerformingAction, setIsPerformingAction ] = useState(false);
  const [ minutesUntilCanRefresh, setMinutesUntilCanRefresh ] = useState(0);

  const isAuthenticated = userState?.isLoggedIn;
  const isLinked = !!habiticaData?.id;

  // Compute cooldown based on last_refreshed_at from the tool instance
  useEffect(() => {
    if (!toolInstance?.last_refreshed_at) {
      if (minutesUntilCanRefresh !== 0) {
        setMinutesUntilCanRefresh(0);
      }
      return;
    }

    const updateCooldown = () => {
      const now = Date.now();
      const lastRefreshed = toolInstance.last_refreshed_at;
      const elapsed = now - lastRefreshed;
      const remaining = Math.max(0, FIVE_MINUTES_MS - elapsed);
      const minutes = Math.ceil(remaining / 60000);
      setMinutesUntilCanRefresh(minutes);
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 10000);
    return () => clearInterval(interval);
  }, [ minutesUntilCanRefresh, toolInstance?.last_refreshed_at ]);


  // Compute days remaining until expiration
  const daysUntilExpiration = useMemo(() => {
    if (!toolInstance?.expires_at) { return null; }
    const now = Date.now();
    const remaining = toolInstance.expires_at - now;
    if (remaining <= 0) { return 0; }
    return Math.ceil(remaining / (24 * 60 * 60 * 1000));
  }, [ toolInstance?.expires_at ]);

  const isToolActive = !!toolInstance && (toolInstance.expires_at === null || toolInstance.expires_at > Date.now());

  const actionHandler = useCallback(async (action) => {
    setIsPerformingAction(true);
    try {
      await action?.();
    } finally {
      setIsPerformingAction(false);
    }
  }, []);


  const handleDeactivate = useCallback(() => {
    openConfirmation?.({
      title: 'Deactivate Tool?',
      content: 'This will stop all automations for this tool and remove any associated data. You can reactivate anytime.',
      primaryButtonText: 'Deactivate',
      secondaryButtonText: 'Cancel',
      onRequestSubmit: async () => await actionHandler(onDeactivate),
    });
  }, [ openConfirmation, actionHandler, onDeactivate ]);

  const openWhyExpirationModal = useCallback(() => {
    openConfirmation?.({
      content: <MarkdownMui.Markdown>{ whyExpirationContent }</MarkdownMui.Markdown>,
      primaryButtonText: 'Close',
      removeSecondaryAction: true,
    });
  }, [ openConfirmation ]);

  
  // Render: Not authenticated
  if (!isAuthenticated) {
    return (
      <L.section>
        <Stack spacing={ 2 }>
          <L.p>You must be sign-up or login to use this tool.</L.p>
          <AuthCtaButtons returnPath="/tools/auto-accept-quests" />
        </Stack>
      </L.section>
    );
  }

  // Render: Authenticated but not linked
  if (!isLinked || !!habiticaAccountManagerModalOpen) {
    return (
      <L.section>
        <Stack spacing={ 2 }>
          <L.h3>Link Your Account</L.h3>
          <L.p color="textSecondary">
            You must link a Habitica account to use this tool.
          </L.p>
          <Button
            variant="contained"
            color="primary"
            onClick={ () => setHabiticaAccountManagerModalOpen(true) }
          >
            Manage Habitica Account
          </Button>
        </Stack>

        <HabiticaAccountManagerModal
          open={ habiticaAccountManagerModalOpen }
          onClose={ () => setHabiticaAccountManagerModalOpen(false) }
        />
      </L.section>
    );
  }

  // Render: Authenticated and linked
  return (
    <L.section>
      <Stack spacing={ 3 }>
        {!isToolActive && (
          <Stack spacing={ 2 }>
            <L.p color="textSecondary">
              This tool is not active yet.
            </L.p>
            <Button
              variant="contained"
              color="primary"
              disabled={ isPerformingAction || isLoading }
              startIcon={ isPerformingAction && <CircularProgress size={ 20 } /> }
              onClick={ () => actionHandler(onActivate) }
            >Activate Tool</Button>
          </Stack>
        )}

        {isToolActive && (
          <Stack spacing={ 0.5 } justifyContent="center" alignItems="center">
            {daysUntilExpiration !== null && (
              <Stack direction="row" alignItems="center" justifyContent="center">
                <L.p fontSize="small" color="textSecondary" sx={{ mb: 0 }}>
                  <strong>Tool expires in:</strong> { daysUntilExpiration } days
                </L.p>
                <IconButton
                  size="small"
                  aria-label="Why an expiration?"
                  onClick={ openWhyExpirationModal }
                >
                  <HelpOutlineIcon fontSize="inherit" />
                </IconButton>
              </Stack>
            )}

            {/* Action buttons */}
            <Stack direction="row" spacing={ 1 }>
              <Button
                variant="contained"
                color="primary"
                disabled={ isPerformingAction || minutesUntilCanRefresh > 0 || isLoading }
                startIcon={ isPerformingAction && <CircularProgress size={ 20 } /> }
                onClick={ () => actionHandler(onRefresh) }
              >
                {
                  minutesUntilCanRefresh > 0
                    ? `Refresh in ${ minutesUntilCanRefresh } minute${ minutesUntilCanRefresh !== 1 ? 's' : '' }` 
                    : 'Refresh Expiration'
                }
              </Button>

              <Button
                variant="outlined"
                color="error"
                disabled={ isPerformingAction || isLoading }
                startIcon={ isPerformingAction && <CircularProgress size={ 20 } /> }
                onClick={ handleDeactivate }
              >Deactivate</Button>
            </Stack>
          </Stack>
        )}
      </Stack>
    </L.section>
  );
};

export default ToolCockpit;
