import React, { useContext, useState, useEffect, useMemo } from 'react';
import {
  Stack,
  Button,
  Typography,
} from '@mui/material';
import { LoadingElement, PageHead, Link, L, HabiticaAccountManagerModal } from 'components';
import { usePageManager } from 'lib/hooks';
import { userContext } from 'lib/contexts/UserContext';
// import { useMutateCreatePortalSession } from 'lib/api/methods/commerceApi';
import { SettingsCards, ChangePassword, ChangeUserDetails, DeleteAccount, ChangeEmail, AdminControls } from './components';

const FULL_ACCESS_PERMISSIONS = [
  'super_admin_permission_control',
  'admin_permission_composition',
];

const VIEW_ADMIN_CONTROLS = [
  ...FULL_ACCESS_PERMISSIONS,
  'admin_permission_assignment',
  'access_permissions_view',
];


const MyAccountPage = () => {
  // const [ isLoadingPortal, setIsLoadingPortal ] = useState(false);
  const [ internalPageSlug, setInternalPageSlug ] = useState('main');
  const [ habiticaAccountManagerModalOpen, setHabiticaAccountManagerModalOpen ] = useState(false);
  const { userState, userDispatch } = useContext(userContext);

  // On page load, refresh the user's information.
  useEffect(() => {
    if (userState?.user?.id) {
      userDispatch({ type: 'REFRESH_USER' } );
    }
  }, [ userDispatch, userState?.user?.id ]);

  // Whenever the internal page is "success", refresh the user's information to reflect any changes.
  useEffect(() => {
    if (internalPageSlug === 'success' && userState?.user?.id) {
      userDispatch({ type: 'REFRESH_USER' } );
    }
  }, [ internalPageSlug, userDispatch, userState?.user?.id ]);

  const {
    activateRouting,
    pageStage,
    setPageStage,
    pageError,
    setPageError,
    handleApiError,
    openConfirmation,
    updateConfirmation,
  } = usePageManager({
    defaultHandleApiError: {
      returnPath: '/my-account',
      handledErrors: [ 'PASSWORDS_CANNOT_MATCH', 'INCORRECT_PASSWORD', 'USER_DELETE_INVALID_PASSWORD', 'INVALID_EMAIL' ],
    },
    defaultPageStage: 'loading',
  });

  const handleLogout = () => {
    setPageStage('loading');
    activateRouting('/login?logout=true');
  };

  // const { mutate: createPortalSession } = useMutateCreatePortalSession({
  //   onError: () => {
  //     setIsLoadingPortal(false);
  //     handleLogout();
  //   },
  // });

  const accountSettingPages = useMemo(() => ([
    /* {
      slug: 'billing',
      title: 'Manage Billing',
      description: 'Open the billing portal to update payment information, invoices, or subscription details.',
      buttonProps: {
        label: 'Open Portal',
        loading: isLoadingPortal,
        onClick: () => {
          setIsLoadingPortal(true);
          createPortalSession();
        },
      },
    },*/ {
      slug: 'habitica_account_manager',
      title: 'Habitica Account',
      description: 'Link, unlink, and manage your connected Habitica account.',
      buttonProps: {
        label: 'Manage Habitica',
        onClick: () => setHabiticaAccountManagerModalOpen(true),
      },
    }, {
      slug: 'change_password',
      title: 'Change Password',
      description: 'Update the password you use to sign in and keep your account secure.',
      buttonProps: {
        onClick: () => setInternalPageSlug('change_password'),
      },
    }, {
      slug: 'change_email',
      title: 'Change Email',
      description: 'Update the email address associated with your account.',
      buttonProps: {
        onClick: () => setInternalPageSlug('change_email'),
      },
    }, {
      slug: 'update_details',
      title: 'Update Account Details',
      description: 'Review and edit your personal account information and profile details.',
      buttonProps: {
        onClick: () => setInternalPageSlug('update_details'),
      },
    }, {
      slug: 'delete_account',
      title: 'Delete Account',
      description: 'Permanently remove your account and all associated data.',
      buttonProps: {
        label: 'Delete Your Account',
        onClick: () => setInternalPageSlug('delete_account'),
      },
      isDangerous: true,
    },
  ]), [ setInternalPageSlug, setHabiticaAccountManagerModalOpen ]);

  return (
    <>
      <PageHead title="My Account" />

      <HabiticaAccountManagerModal
        open={ habiticaAccountManagerModalOpen }
        onClose={ () => setHabiticaAccountManagerModalOpen(false) }
      />

      { pageStage === 'loading' && (
        <LoadingElement article width="100%" />
      )}

      { pageStage === 'main' && (
        <>
          { internalPageSlug === 'success' && (
            <Stack alignItems="center" textAlign="center" my={ 5 }>
              <L.h2 color="secondary">Your settings have been saved.</L.h2>
            </Stack>
          )}

          { (internalPageSlug === 'main' || internalPageSlug === 'success') && (
            <>
              <Stack spacing={ 2 } mb={ 4 } direction={{ xss: 'column', xs: 'row' }} alignItems="center">
                <Link href="/">
                  <Button
                    variant="outlined"
                    color="primary"
                  >Back to Home</Button>
                </Link>
                <Button
                  sx={{ marginTop: 2 }}
                  variant="contained"
                  color="primary"
                  onClick={ () => handleLogout() }
                >Logout</Button>
              </Stack>
              <Stack spacing={ 3 } my={ 3 }>
                <L.section>
                  <Stack spacing={ 1.5 } mb={ 2 }>
                    <L.h2 color="primary">Account Settings</L.h2>
                  </Stack>

                  <SettingsCards accountSettingPages={ accountSettingPages?.filter(link => !link.isDangerous) } />
                </L.section>
              </Stack>

              {userState?.permissionsCheck.oneOf(VIEW_ADMIN_CONTROLS) && (
                <Stack>
                  <SettingsCards
                    accountSettingPages={ [{
                      slug: 'admin_controls',
                      title: 'Admin Controls',
                      description: 'Access administrative controls and settings.',
                      buttonProps: {
                        onClick: () => setInternalPageSlug('admin_controls'),
                      },
                    }] }
                  />
                </Stack>
              )}

              <Stack spacing={ 3 } my={ 3 }>
                <L.section>
                  <Stack spacing={ 1.5 } mb={ 2 }>
                    <L.h2 color="warning">Danger Zone</L.h2>
                  </Stack>

                  <SettingsCards accountSettingPages={ accountSettingPages?.filter(link => link.isDangerous) } />
                </L.section>
              </Stack>
            </>
          )}

          { internalPageSlug === 'change_password' && (
            <ChangePassword
              setInternalPageSlug={ setInternalPageSlug }
              handleApiError={ handleApiError }
            />
          )}

          { internalPageSlug === 'change_email' && (
            <ChangeEmail
              setInternalPageSlug={ setInternalPageSlug }
              handleApiError={ handleApiError }
              activateRouting={ activateRouting }
              setPageStage={ setPageStage }
              openConfirmation={ openConfirmation }
              userState={ userState }
              userDispatch={ userDispatch }
            />
          )}

          { internalPageSlug === 'update_details' && (
            <ChangeUserDetails
              setInternalPageSlug={ setInternalPageSlug }
              handleApiError={ handleApiError }
              userState={ userState }
            />
          )}

          {( internalPageSlug === 'delete_account' ) && (
            <DeleteAccount
              setInternalPageSlug={ setInternalPageSlug }
              activateRouting={ activateRouting }
              setPageStage={ setPageStage }
              handleApiError={ handleApiError }
              userDispatch={ userDispatch }
              userState={ userState }
              openConfirmation={ openConfirmation }
            />
          )}

          { internalPageSlug === 'admin_controls' && (
            <AdminControls
              setInternalPageSlug={ setInternalPageSlug }
              activateRouting={ activateRouting }
              setPageStage={ setPageStage }
              handleApiError={ handleApiError }
              userDispatch={ userDispatch }
              userState={ userState }
              openConfirmation={ openConfirmation }
              updateConfirmation={ updateConfirmation }
            />
          )}
        </>
      )}

      {pageStage === 'error' && (
        <Stack spacing={ 3 } alignItems="center" textAlign="center" my={ 4 }>
          <Typography
            variant="h4"
            color="error"
          >Oops! An error occurred.</Typography>
          <Typography>{ pageError?.message || 'Unknown error' }</Typography>
          <Button
            variant="outlined"
            onClick={ () => setPageError() }
          >Try again</Button>
        </Stack>
      )}
    </>
  );
};


export default MyAccountPage;
