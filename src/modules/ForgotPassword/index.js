import { Button, Stack } from '@mui/material';
import { PageHead, Link, L } from 'components';
import { usePageManager } from 'lib/hooks';
import { ForgotPasswordFields } from './ForgotPasswordFields';
import { useMutateResetPassword } from 'lib/api/methods/userApi';


const ForgotPasswordPage = () => {
  const { mutate: mutateResetPassword } = useMutateResetPassword();

  const {
    pageStage,
    setPageStage,
    pageError,
    handleApiError,
  } = usePageManager({
    defaultHandleApiError: {
      returnPath: '/forgot-password',
      handledErrors: [ 'INVALID_EMAIL' ],
    },
    defaultPageStage: 'main',
  });

  const handleSubmit = (values, { setSubmitting }) => {
    mutateResetPassword({
      email: values.email,
      hcaptchaToken: values.hcaptchaToken,
    }, {
      onSuccess: () => setPageStage('success'),
      onError: error => handleApiError({ error }),
      onSettled: () => setSubmitting(false),
    });
  };


  return (
    <>
      <PageHead title="Forgot Password" />

      {pageStage !== 'success' && (
        <Stack alignItems="center" spacing={ 2 }>
          <Link href="/">
            <Button
              variant="outlined"
              color="primary"
            >Back to Home</Button>
          </Link>
          <L.h1 color="primary">
            Forgot Password
          </L.h1>
          <br />
        </Stack>
      )}


      {/* /////////// */}
      {/* Page Errors */}
      {/* /////////// */}
      {pageError.status === 'INVALID_EMAIL' && (
        <Stack
          maxWidth="50em"
          spacing={ 3 }
          direction="column"
          alignItems="center"
          textAlign="center"
          sx={{ paddingY: 4 }}
        >
          <L.h2 color="text.darkGrey">
            Oops!
          </L.h2>
          <L.p>
            It looks like something went wrong.
          </L.p>
          <L.p>
            Please verify you have typed your email address correctly and try again.
          </L.p>
          <Stack sx={{ paddingTop: 2 }}>
            <Button
              variant="contained"
              size="large" 
              onClick={ () => window.location.reload() }
            >
              Reload Page
            </Button>
          </Stack>
        </Stack>
      )}
      

      {/* /////////// */}
      {/* Page Stages */}
      {/* /////////// */}
      {pageStage === 'success' && (
        <Stack
          maxWidth="50em"
          spacing={ 3 }
          direction="column"
          alignItems="center"
          textAlign="center"
          sx={{ paddingY: 4 }}
        >
          <L.h2 color="primary">
            Password Reset Sent!
          </L.h2>
          <L.p>
            If that email address is in our system then we've sent you an email with further instructions to reset your password.
          </L.p>
          <L.p>
            If you don't see the email immediately, please check your spam folder and allow for up to 10 minutes for the email to arrive.
            If you still don't see it, please try again.
          </L.p>
          <Stack sx={{ paddingTop: 2 }}>
            <Link href="/login">
              <Button
                variant="contained" 
                size="large"
              >
                Login
              </Button>
            </Link>
          </Stack>
        </Stack>
      )}


      {pageStage === 'main' && (
        <Stack sx={{ mb: 4 }} alignItems="center" spacing={ 2 }>
          <ForgotPasswordFields
            onSubmit={ handleSubmit }
          />
        </Stack>
      )}
    </>
  );
};


export default ForgotPasswordPage;
