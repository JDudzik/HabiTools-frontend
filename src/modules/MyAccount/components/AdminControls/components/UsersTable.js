import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Stack,
  Box,
  TextField,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { L, VirtualizedTableSimple, SimpleDisplay } from 'components';
import { useApiSearchUsers } from 'lib/api/methods/adminControlsApi';


const SEARCH_DEBOUNCE_MS = 500;

const formatDateTime = (timestamp) => {
  if (!timestamp) { return '-'; }

  const parsed = Number(timestamp);
  if (Number.isNaN(parsed)) { return '-'; }

  return new Date(parsed).toLocaleString();
};

const AccordionDataView = ({ title, data }) => {
  return (
    <Accordion disableGutters>
      <AccordionSummary expandIcon={ <ExpandMoreIcon /> }>
        <L.p mb={ 0 }><strong>{title}</strong></L.p>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          component="pre"
          sx={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowX: 'auto',
            fontSize: '0.8rem',
            m: 0,
          }}
        >
          { JSON.stringify(data ?? null, null, 2) }
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export const UsersTable = (props) => {
  const { openConfirmation, handleApiError } = props;

  const [ searchInput, setSearchInput ] = useState('');
  const [ debouncedSearchInput, setDebouncedSearchInput ] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchInput(searchInput);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [ searchInput ]);

  const normalizedSearchInput = debouncedSearchInput?.trim();

  const {
    data: usersData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useApiSearchUsers({
    ...(normalizedSearchInput ? { email: normalizedSearchInput } : {}),
  });

  useEffect(() => {
    if (isError && handleApiError) {
      handleApiError({ error, handledErrors: []});
    }
  }, [ isError, error, handleApiError ]);

  const orderedUsers = useMemo(() => {
    if (!Array.isArray(usersData)) {
      return [];
    }

    return [ ...usersData ].sort((a, b) => {
      const aCreatedAt = Number(a?.created_at || 0);
      const bCreatedAt = Number(b?.created_at || 0);
      return bCreatedAt - aCreatedAt;
    });
  }, [ usersData ]);

  const openUserDetailsModal = useCallback((user) => {
    const {
      groups,
      permissions,
      user_subscriptions,
      habitica_user,
      ...remainingUserData
    } = user || {};

    const { habitica_tools, habitica_user_data, ...remainingHabiticaUser } = habitica_user || {};
    const {
      achievements: _habiticaAchievements,
      items: _habiticaItems,
      webhooks: _habiticaWebhooks,
      party: habiticaParty,
      ...remainingHabiticaUserData
    } = habitica_user_data || {};

    const habiticaToolsDisplay = habitica_tools
      ?.map(tool => tool.tool_slug)
      ?.join(', ') || '-';

    openConfirmation?.({
      title: user?.email || 'User Details',
      content: (
        <Stack spacing={ 1.5 } mt={ 1 } alignItems="stretch">
          <SimpleDisplay sensitive title="ID" sx={{ flexGrow: 1, m: 1 }} color="secondary.main">
            { user?.id || '-' }
          </SimpleDisplay>
          <SimpleDisplay sensitive title="Created" sx={{ flexGrow: 1, m: 1 }} color="secondary.main">
            { formatDateTime(user?.created_at) }
          </SimpleDisplay>
          <SimpleDisplay sensitive title="Email" sx={{ flexGrow: 1, m: 1 }} color="secondary.main">
            { user?.email || '-' }
          </SimpleDisplay>
          <SimpleDisplay sensitive title="First Name" sx={{ flexGrow: 1, m: 1 }} color="secondary.main">
            { user?.first_name || '-' }
          </SimpleDisplay>
          <SimpleDisplay sensitive title="Last Name" sx={{ flexGrow: 1, m: 1 }} color="secondary.main">
            { user?.last_name || '-' }
          </SimpleDisplay>

          <AccordionDataView title="Primary User Data" data={ remainingUserData } />
          <AccordionDataView title="Groups" data={ groups } />
          <AccordionDataView title="Permissions" data={ permissions } />
          <AccordionDataView title="Subscriptions" data={ user_subscriptions } />
          <AccordionDataView title="Habitica User" data={{ user: remainingHabiticaUser, userData: remainingHabiticaUserData, party: habiticaParty }} />
          <AccordionDataView title="Habitica Tools" data={ `[${ habiticaToolsDisplay }]` } />
          <AccordionDataView title="Habitica Tools (Full Data)" data={ habitica_tools } />
        </Stack>
      ),
      primaryButtonText: 'Close',
      removeSecondaryAction: true,
    });
  }, [ openConfirmation ]);

  const rows = useMemo(() => {
    return orderedUsers.map(user => ({
      onClick: () => openUserDetailsModal(user),
      columns: [{
        key: `${ user?.id }-created`,
        element: formatDateTime(user?.created_at),
      }, {
        key: `${ user?.id }-email`,
        element: user?.email || '-',
      }, {
        key: `${ user?.id }-name`,
        element: `${ user?.first_name || '' } ${ user?.last_name || '' }`.trim() || '-',
      }, {
        key: `${ user?.id }-status`,
        element: user?.disabled_at ? 'Disabled' : 'Active',
      }],
    }));
  }, [ orderedUsers, openUserDetailsModal ]);

  return (
    <Stack spacing={ 3 } width="100%">
      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load users.
        </Alert>
      )}

      <VirtualizedTableSimple
        size="small"
        height="30vh"
        isLoading={ isLoading || isFetching }
        title={ (
          <Stack direction="row" spacing={ 1 } mb={ 1 } alignItems={{ xxs: 'flex-start', sm: 'center' }}>
            <L.h4 color="text.white" mb={ 0 }>Users</L.h4>
            <L.p color="text.white" m={ 0 }>({ orderedUsers.length })</L.p>
          </Stack>
        ) }
        subtitle={ (
          <Stack direction={{ xxs: 'column', sm: 'row' }} spacing={ 1.5 } alignItems={{ xxs: 'stretch', sm: 'center' }}>
            <TextField
              fullWidth
              color="white"
              size="small"
              label="Search by Email"
              placeholder="Type an email address"
              value={ searchInput }
              onChange={ event => setSearchInput(event.target.value || '') }
            />
          </Stack>
        ) }
        noDataMessage="No users found"
        noDataIcon={ PersonOutlineIcon }
        headers={ [{
          label: 'Created',
          key: 'created',
          width: '10rem',
        }, {
          label: 'Email',
          key: 'email',
          width: '18rem',
        }, {
          label: 'Name',
          key: 'name',
          width: '12rem',
        }, {
          label: 'Status',
          key: 'status',
          width: '6rem',
        }] }
        rows={ rows }
      />
    </Stack>
  );
};
