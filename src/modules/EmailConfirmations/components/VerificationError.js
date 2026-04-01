import React from 'react';
import { useMutateSubmitError } from 'lib/api/methods/errorApi';
import { Link, L } from 'components';
import { Stack } from '@mui/material';


const getErrorStatus = verificationObj => verificationObj?.status || 'NO_STATUS';

const errorOptions = {
  NO_STATUS: {
    title: 'We\'re looking into it',
    message: 'You can try closing all tabs and re-opening your browser',
    showOops: true,
    showPerists: true,
  },
  UNKNOWN_ERROR: {
    title: 'We\'re looking into it',
    message: 'You can try closing all tabs and re-opening your browser',
    showOops: true,
    showPerists: true,
  },
  FAILED_TO_FETCH: {
    title: 'You may be offline',
    message: 'Please make sure you\'re connected to the internet and try again',
    showOops: false,
    showPerists: true,
  },
  CONFIRMATION_INVALID: {
    title: 'This is an invalid confirmation',
    message: 'Please make sure that you are using the link that was sent to your email',
    showOops: true,
    showPerists: true,
  },
  CONFIRMATION_ALREADY_COMPLETED: {
    title: 'This has already been completed!',
    message: 'You\'ve already visited this link and you\'re all set!',
  },
  CONFIRMATION_EXPIRED: {
    title: 'This link has expired!',
    message: 'Looks like this link has expired. If you still need to perform this action, you\'ll restart the process to get a new one.',
  },
};


export const VerificationError = (props) => {
  const { mutate: mutateSubmitError } = useMutateSubmitError();  
  const errorStatus = getErrorStatus(props.pageError);
  const isUnknownError = !errorOptions[errorStatus];
  const pickedError = errorOptions[errorStatus] || errorOptions.UNKNOWN_ERROR;

  if (errorStatus === 'NO_STATUS' || isUnknownError) {
    mutateSubmitError({
      source: 'VerificationError.unknown_error',
      message: `Provided status/message: ${ props?.verifyErrorData?.status || props?.verifyErrorData?.message }`,
      message_json: props?.verifyErrorData,
    });
  }

  return (
    <>
      <Stack
        maxWidth="50em"
        spacing={ 3 }
        direction="column"
        alignItems="start"
        textAlign="start"
        sx={{ paddingY: 4 }}
      >
        {pickedError.showOops && (
          <>
            <L.h2 color="text.darkGrey">
              Oops!
            </L.h2>
            <L.p>
              It looks like something went wrong.
            </L.p>
          </>
        )}
        <L.h2 color="primary">
          {pickedError.title}
        </L.h2>
        <L.p>
          {pickedError.message}
        </L.p>
        {pickedError.showPerists && (
          <L.p>
            If this problem continues, please contact support through the{' '}
            <Link href="/feedback">Feedback Page</Link>
          </L.p>
        )}
      </Stack>
    </>
  );

};
