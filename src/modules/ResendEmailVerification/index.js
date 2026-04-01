import { useState, useEffect, useRef } from 'react';
import { Button, Stack } from '@mui/material';
import { PageHead, Link, L } from 'components';
import { ResendForm } from './ResendForm';
import { PageErrors } from './PageErrors';
import { usePageManager } from 'lib/hooks';
import { useMutateResendVerifyEmail } from 'lib/api/methods/userApi';


const RESEND_COOLDOWN = 15;

const ResendEmailVerification = () => {
  const [ cooldown, setCooldown ] = useState(0);
  const cooldownRef = useRef();
  const { mutate: mutateResendVerifyEmail } = useMutateResendVerifyEmail();

  useEffect(() => {
    if (cooldown > 0) {
      cooldownRef.current = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(cooldownRef.current);
  }, [ cooldown ]);

  const {
    pageStage,
    setPageStage,
    pageError,
    handleApiError,
  } = usePageManager({
    defaultHandleApiError: {
      returnPath: '/resend-email-verification',
      handledErrors: [ 'ALREADY_VERIFIED_EMAIL', 'NO_USER_WITH_EMAIL' ],
    },
    defaultPageStage: 'main',
  });

  const handleResend = (values, { setSubmitting }) => {
    const submissionData = { email: values.email };
    setCooldown(RESEND_COOLDOWN);

    mutateResendVerifyEmail(submissionData, {
      onSuccess: () => setPageStage('success'),
      onError: error => handleApiError({ error }),
      onSettled: () => setSubmitting(false),
    });
  };

  return (
    <>
      <PageHead title="Resend Verification Email" />

      <PageErrors pageError={ pageError } />

      {/* /////////// */}
      {/* Page Stages */}
      {/* /////////// */}
      { pageStage === 'main' && (
        <>
          <Link href="/">
            <Button
              variant="outlined"
              color="primary"
            >Back to Home</Button>
          </Link>
          <br /><br />

          <L.h1 color="primary">
            Send Email Verification
          </L.h1>
          <br />
          <ResendForm 
            onSubmit={ handleResend }
          />
        </>
      )}

      { pageStage === 'success' && (
        <>
          <Stack
            maxWidth="50em"
            spacing={ 3 }
            direction="column"
            alignItems="center"
            textAlign="center"
            sx={{ paddingY: 4 }}
          >
            <L.h2 color="primary">
              Sent!
              <L.h3>
                We've sent another verification email
              </L.h3>
            </L.h2>
            <L.p>
              The email can take up to 10 minutes to arrive. Be sure to check your spam folder too!<br />
              You can close this tab or navigate back to the Login Page.<br />
              If you don't see the email, you can try again.
            </L.p>
            <Stack spacing={ 2 } direction={{ xxs: 'column', sm: 'row' }} >
              <Link href="/login">
                <Button
                  variant="contained"
                  color="primary"
                >Login Page</Button>
              </Link>
              <Button
                variant="outlined"
                color="primary"
                disabled={ cooldown > 0 }
                onClick={ () => setPageStage('main') }
              >
                {cooldown > 0 ? `Retry (${ cooldown })` : 'Retry'}
              </Button>
            </Stack>
          </Stack>
        </>
      )}
    </>
  );
};

export default ResendEmailVerification;