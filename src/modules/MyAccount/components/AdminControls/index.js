import React from 'react';
import {
  Stack,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { L, SimpleDisplay, PopoutMenuButton } from 'components';
import { PermissionControlsTable, UsersTable } from './components';
import MoreVertIcon from '@mui/icons-material/MoreVert';


export const AdminControls = (props) => {
  const { setInternalPageSlug, userState, openConfirmation } = props;

  const openMyDetailsModal = () => {
    openConfirmation({
      title: 'My Account Details',
      content: (
        <Stack spacing={ 1.5 } mt={ 1 } alignItems="stretch">
          <SimpleDisplay sensitive title="Email" sx={{ flexGrow: 1, m: 1 }} color="secondary.main">
            { userState?.user?.email }
          </SimpleDisplay>
          <SimpleDisplay sensitive title="Name" sx={{ flexGrow: 1, m: 1 }} color="secondary.main">
            { `${ userState?.user?.first_name || '' } ${ userState?.user?.last_name || '' }` }
          </SimpleDisplay>
          {userState?.user?.permissions?.length ? (
            <>
              <SimpleDisplay sensitive title="User Permissions" sx={{ flexGrow: 1, m: 1 }} color="secondary.main">
                <L.div pl={ 2 }>
                  { userState.user.permissions.map(perm => <li key={ perm }>{perm}</li>) }
                </L.div>
              </SimpleDisplay>
            </>
          ) : null}
        </Stack>
      ),
      primaryButtonText: 'Close',
      removeSecondaryAction: true,
    });
  };

  return (
    <>
      <L.h2 color="primary" mb={ 2 }>Admin Controls</L.h2>

      <Stack spacing={ 2 } mt={ 2 } mb={ 4 } direction={{ xss: 'column', xs: 'row' }} alignItems="center">
        <Button
          variant="outlined"
          color="primary"
          startIcon={ <ArrowBackIcon /> }
          onClick={ () => setInternalPageSlug('main') }
        >Back to My Account</Button>
      </Stack>

      <PopoutMenuButton
        sx={{ mb: 5 }}
        buttonProps={{
          startIcon: (<MoreVertIcon />),
          variant: 'outlined',
        }}
        buttonChild="More Actions"
        menuItems={ [{
          key: 'hello',
          text: 'View My Account Details',
          onClick: () => openMyDetailsModal(),
          props: { dense: true },
        }] }
      />

      <Stack width="100%" spacing={ 4 }>
        {userState?.permissionsCheck.has('user_retrieval') && (
          <UsersTable { ...props } />
        )}

        {userState?.permissionsCheck.has('access_permissions_view') && (
          <PermissionControlsTable { ...props } />
        )}

      </Stack>
    </>
  );
};