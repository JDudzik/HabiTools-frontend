import React, { useState } from 'react';
import { Stack, Button } from '@mui/material';
import { FormFields } from './FormFields';
import { LoadingElement, PageHead, Link, L } from 'components';
import { PageErrors } from './PageErrors';
import { usePageManager } from 'lib/hooks';
import { useMutateSignUp } from 'lib/api/methods/userApi';


const formFieldDefaults = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
};

const SignUp = () => {
  const [ formFieldValues, setFormFields ] = useState({ ...formFieldDefaults });
  const { mutate: mutateSignUp } = useMutateSignUp();

  const {
    pageStage,
    setPageStage,
    pageError,
    setPageError,
    handleApiError,
  } = usePageManager({
    defaultHandleApiError: {
      returnPath: '/sign-up',
      handledErrors: [ 'FAILED_TO_FETCH', 'EMAIL_ALREADY_EXISTS', 'OTHER_ERROR' ],
    },
    defaultPageStage: 'main',
  });

  const resetForm = (fullReset = true) => {
    if (fullReset) {
      setFormFields({ ...formFieldDefaults });
    } else {
      const { email, password } = formFieldDefaults;
      setFormFields({
        ...formFieldValues,
        email,
        password,
      });
    }

    setPageError();
    setPageStage('main');
  };

  const submitForm = (formValues) => {
    setFormFields(formValues);
    setPageError();
    setPageStage('loading');

    const submissionData = {
      email: formValues.email,
      password: formValues.password,
      first_name: formValues.firstName,
      last_name: formValues.lastName,
      hcaptchaToken: formValues.hcaptchaToken,
    };

    mutateSignUp(submissionData, {
      onSuccess: () => setPageStage('completed'),
      onError: error => handleApiError({ error }),
    });
  };

  return (
    <L.div paddingX={ 2 }>
      <PageHead title="Sign Up" />

      {pageStage !== 'completed' && (
        <>
          <Stack direction={{ xxs: 'column', xs: 'row' }} spacing={ 1 } justifyContent="center">
            <L.p mt={ 2 } mb={ 0.5 } fontSize="1.25em">
              Already have an account?{' '}
              <Link href="/login">Login</Link>
            </L.p>
          </Stack>
          <L.h1 marginTop={ 1 } color="primary">
            Sign-up
          </L.h1>
          <br />
        </>
      )}

      <PageErrors 
        pageError={ pageError }
        formFieldValues={ formFieldValues }
        resetForm={ resetForm }
      />

      {/* /////////// */}
      {/* Page Stages */}
      {/* /////////// */}
      {pageStage === 'main' && (
        <div>
          <FormFields
            formFieldValues={ formFieldValues }
            submitForm={ submitForm }
            resetForm={ resetForm }
          />
        </div>
      )}

      {pageStage === 'loading' && (
        <LoadingElement article width="100%" />
      )}

      {pageStage === 'completed' && (
        <Stack
          spacing={ 3 }
          direction="column"
          alignItems="center"
          textAlign="center"
          sx={{ paddingY: 4 }}
        >
          <L.h1 color="primary">
            Congratulations!
          </L.h1>
          <L.p>
            You're all set to login.
          </L.p>
          <L.p>
            Additionally, we've sent an email to <b>{formFieldValues.email}</b> to verify your email address.<br />
            Please allow for up to 10 minutes for this email to arrive. You may also need to check your spam/junk folder.
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
    </L.div>
  );
};

export default SignUp;