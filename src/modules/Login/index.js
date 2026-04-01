import { useState, useContext, useEffect } from 'react';
import { Stack } from '@mui/material';
import { PageHead, Link, L } from 'components';
import { LoginForm } from './LoginForm';
import { PageErrors } from './PageErrors';
import { userContext } from 'lib/contexts/UserContext';
import { usePageManager } from 'lib/hooks';
import { useMutateLogin } from 'lib/api/methods/userApi';
import { getQueryString } from 'lib/utils/misc';


const Login = () => {
  const { userState, userDispatch } = useContext(userContext);
  const { mutate: mutateLogin } = useMutateLogin();
  const [ heldEmail, setHeldEmail ] = useState('');
  const [ hasLoggedOut, setHasLoggedOut ] = useState(false);

  const {
    activateRouting,
    pageError,
    setPageError,
    handleApiError,
  } = usePageManager({
    defaultHandleApiError: {
      returnPath: '/login',
      handledErrors: [ 'INVALID_CREDENTIALS', 'USER_IS_DELETED', 'UNVERIFIED_EMAIL' ],
    },
    defaultRoutingPath: '/my-account',
  });

  // When this page mounts
  useEffect(() => {
    const shouldLogout = getQueryString('logout');
    if (shouldLogout && hasLoggedOut === false) {
      setHasLoggedOut(true);
      userDispatch({ type: 'LOGOUT' });
      return;
    }

    if (userState.isLoggedIn && !(shouldLogout && hasLoggedOut === false)) {
      activateRouting(); // This line takes care of routing whenever the user is logged in, including after sign-in
    }
  }, [ activateRouting, hasLoggedOut, userDispatch, userState.isLoggedIn ]);

  const handleLogin = (values, { setSubmitting }) => {
    const { email, password } = values;
    setHeldEmail(email);
    setPageError();
    mutateLogin({ email, password }, {
      onSuccess: () => {
        activateRouting();
      },
      onError: error => handleApiError({ error }),
      onSettled: () => setSubmitting(false),
    });
  };

  return (
    <Stack width="100%" maxWidth="20em">
      <PageHead title="Login" />

      <Stack direction={{ xxs: 'column', xs: 'row' }} spacing={ 1 } justifyContent="center">
        <L.p mt={ 2 } mb={ 0.5 } fontSize="1.25em">
          New here?{' '}
          <Link href="/sign-up">Create an account</Link>
        </L.p>
      </Stack>

      {hasLoggedOut && (
        <L.p
          mt={ 2 }
          color="warning"
          sx={{ border: '0.5px solid', borderRadius: 2, padding: 1 }}
        >
          For your security, you have been logged-out. Please log back in.
        </L.p>
      )}

      <L.h1 marginTop={ 1 } color="primary">
        Login
      </L.h1>

      <PageErrors pageError={ pageError } heldEmail={ heldEmail } />

      {/* /////////// */}
      {/* Page Stages */}
      {/* /////////// */}
      <>
        <LoginForm onSubmit={ handleLogin } />
      </>
    </Stack>
  );
};

export default Login;