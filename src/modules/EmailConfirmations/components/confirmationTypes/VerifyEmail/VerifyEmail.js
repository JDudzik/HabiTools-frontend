import React, { useState, useEffect } from 'react';

// Visuals (Components, Modules)
import { Button, Stack } from '@mui/material';
import { LoadingElement } from 'components/LoadingElement';
import { Link, L } from 'components';

// Logic (Utils, Contexts, APIs)
import { useMutateResolveEmailConfirmation } from 'lib/api/methods/emailConfirmationApi';


export const VerifyEmail = (props) => {
  const { type, token, handleApiError } = props;
  const [ completed, setCompleted ] = useState();
  const { mutate: mutateResolveEmailConfirmation } = useMutateResolveEmailConfirmation();

  useEffect(() => {
    if (type && !completed) {
      mutateResolveEmailConfirmation({ type, token }, {
        onSuccess: () => setCompleted(true),
        onError: error => handleApiError({ error }),
      });
    }
  }, [ type, token, mutateResolveEmailConfirmation, handleApiError, completed ]);

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
          </L.h2>
          <L.p>
            Your email has been verified and you're all set to login!
          </L.p>
          <Link href="/login">
            <Button
              variant="contained"
              color="primary"
            >Login Page</Button>
          </Link>
        </Stack>
      ) : <LoadingElement article />}
    </>

  );

};
