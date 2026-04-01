import React, { useState } from 'react';
import { useMutateResolveEmailConfirmation } from 'lib/api/methods/emailConfirmationApi';
import { ResetPasswordFields } from './ResetPasswordFields';
import { Button, Stack } from '@mui/material';
import { Link, L } from 'components';


export const ResetPassword = (props) => {
  const { type, token, handleApiError } = props;
  const [ completed, setCompleted ] = useState();
  const { mutate: mutateResolveEmailConfirmation } = useMutateResolveEmailConfirmation();


  const sendComplete = (values) => {
    const options = { new_password: values.passwordOne };
    mutateResolveEmailConfirmation({ type, token, options }, {
      onSuccess: () => setCompleted(true),
      onError: error => handleApiError({ error }),
    });
  };

  return (
    <>
      {completed ? (
        <Stack
          maxWidth="50em"
          spacing={ 3 }
          direction="column"
          alignItems="center"
          textAlign="center"
          sx={{ paddingY: 4 }}
        >
          <L.h2 color="primary">
            Congrats!
            <L.h3>
              Your password has successfully been updated!
            </L.h3>
          </L.h2>
          <L.p>
            You can login with your new password.
          </L.p>
          <Link href="/login">
            <Button
              variant="contained"
              color="primary"
            >Login Page</Button>
          </Link>
        </Stack>
      ) : (
        <>
          <L.h1 color="primary" sx={{ mb: 2 }}>
            Reset Password
          </L.h1>
          <ResetPasswordFields
            onSubmit={ sendComplete }
          />
        </>
      )}
    </>
  );

};
