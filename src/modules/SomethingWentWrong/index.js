import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { PageHead, Link, L } from 'components';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';
import { useMutateSubmitError } from 'lib/api/methods/errorApi';


const SomethingWentWrong = (props) => {
  const [ derivedStatus, setDerivedStatus ] = useState();
  const router = useRouter();
  const { mutate: mutateSubmitError } = useMutateSubmitError();
  const { status, message, return_path } = router.query;
  const normalizedStatus = `${ status }`.toUpperCase();

  useEffect(() => {
    const handledErrors = [
      'FAILED_TO_FETCH',   'USER_IS_DELETED',       'UNVERIFIED_EMAIL',
      'TOO_MANY_ATTEMPTS', 'INADEQUATE_PERMISSION', 'INVALID_CREDENTIALS',
      'API_ERROR',         'INVALID_URL',           'LOAD_FAILED',
      'ERR_NETWORK',       'UNAUTHORIZED_ACCESS',   'HCAPTCHA_VERIFICATION_FAILED',
      'DECRYPTION_FAILED',
    ];

    if (handledErrors.includes(normalizedStatus)) {
      setDerivedStatus(normalizedStatus);
    } else {
      setDerivedStatus('OTHER_ERROR');
      mutateSubmitError({
        source: 'ErrorPage.OTHER_ERROR',
        message: `URL: ${ window.location.href }`,
        message_json: props,
      });
    }
  }, [ normalizedStatus, return_path, props, mutateSubmitError ]);

  let timeUntilNextAttempt = '';
  if (derivedStatus === 'TOO_MANY_ATTEMPTS' && message) {
    const createdAtDT = DateTime.fromMillis(parseInt(message, 10)).startOf('second');
    timeUntilNextAttempt = createdAtDT
      .diff(DateTime.now().startOf('second'))
      .shiftTo('years', 'days', 'hours', 'minutes', 'seconds')
      .toHuman()
      .replaceAll(/((?:\W|^)0\W.\w*,)/g, '')
      .trim();
  }

  return (
    <L.div sx={{ paddingY: 2 }}>
      <PageHead title="Something Went Wrong" />

      <Link href="/">
        <Button
          variant="outlined"
          color="primary"
        >Back to Home</Button>
      </Link>
      <br /><br />


      {/* ///////////// */}
      {/* Page Statuses */}
      {/* ///////////// */}
      {[ 'FAILED_TO_FETCH', 'LOAD_FAILED', 'ERR_NETWORK' ].includes(derivedStatus) && (
        <>
          <h2>You're offline</h2>
          <p>
            It looks like your device has lost connection.<br />
            Please try reconnecting or trying again when the connection is more stable.
          </p>
          <p>If this problem is incorrect, please contact support through the <Link href="/feedback?source=ErrorPage.failed_to_fetch">Feedback Page</Link></p>
          <br />
          <Button
            variant="contained"
            color="primary"
            onClick={ router.back }
          >Retry Page</Button>
        </>
      )}


      {derivedStatus === 'USER_IS_DELETED' && (
        <>
          <h2>This User Has Been Deleted</h2>
          <p>
            The user you have attempted to log into has been deleted from the system.<br />
            You can sign up for a new account from the <Link href="/sign-up">Sign-up Page</Link>.<br />
            Please be aware that you will be unable to use this same email address as it was already registered once.
          </p>
        </>
      )}


      {derivedStatus === 'UNVERIFIED_EMAIL' && (
        <>
          <h2>You Must Verify Your Email</h2>
          <p>
            You have not verified your email address yet!
          </p>
          <p>Would you like to resend the instructions to your email address?</p>

          <Link href="/resend-email-verification">
            <Button
              variant="contained"
              color="primary"
            >Resend Email Verification</Button>
          </Link>
          <br /><br />
        </>
      )}


      {derivedStatus === 'TOO_MANY_ATTEMPTS' && (
        <>
          <h2>You've tried that too many times</h2>
          <p>
            It looks like you've tried to perform that action too many times and too quickly.<br />
            You will have to wait a while before trying that action again.
          </p>
          {message && (
            <p>
              You'll be able to try again in <b>{ timeUntilNextAttempt }</b>
            </p>
          )}
          <br />
          <Button
            variant="contained"
            color="primary"
            onClick={ router.back }
          >Back to previous page</Button>
        </>
      )}


      {derivedStatus === 'INADEQUATE_PERMISSION' && (
        <>
          <h2>You do not have the that permission</h2>
          <p>
            It looks like you tried to perform an action that you don't have the permission to do.<br />
            If this is incorrect, try logging out and make sure to log into the correct account.<br />
            If this problem continues, please contact support through the <Link href="/feedback">Feedback Page</Link>.
          </p>
        </>
      )}


      {derivedStatus === 'INVALID_CREDENTIALS' && (
        <>
          <h2>Incorrect Email or Password</h2>
          <p>
            The email and/or password provided are incorrect.<br />
            You can reset your password from the <Link href="/forgot-password">Forgot Password Page</Link>.<br />
            or you can try to login again from the <Link href="/login?logout=true">Login Page</Link>.<br />
            If this problem continues, please contact support through the <Link href="/feedback?source=ErrorPage.invalid_credentials">Feedback Page</Link>.
          </p>
        </>
      )}


      {derivedStatus === 'UNAUTHORIZED_ACCESS' && (
        <>
          <h2>You Aren't Authorized to Perform That Action.</h2>
          <p>
            { message }<br />
            It could be that your access has been revoked.<br />
            If this seems incorrect, please contact support through the <Link href="/feedback?source=ErrorPage.unauthorized_access">Feedback Page</Link>.
          </p>
        </>
      )}

      {derivedStatus === 'DECRYPTION_FAILED' && (
        <>
          <h2>Something went wrong with your Habitica Account</h2>
          <p>
            It looks like we can't properly decrypt your Habitica account details.<br />
            This will likely require you to unlink and then re-link your Habitica account to fix it. You can access your account settings from the <Link href="/my-account">My Account page</Link>.<br /><br />
            
            If this seems incorrect or the problem persists after relinking your account, please contact support through the <Link href="/feedback?source=ErrorPage.decryption_failed">Feedback Page</Link>.
          </p>
        </>
      )}

      {[ 'OTHER_ERROR', 'API_ERROR', 'INVALID_URL', 'HCAPTCHA_VERIFICATION_FAILED' ].includes(derivedStatus) && (
        <div>
          {process.env.NODE_ENV === 'development' && (
            <div>
              <b>Dev Error Status:</b><br />
              {`status: ${ derivedStatus }`}<br />
              {`message: ${ message }`}<br />
              {`returnPath: ${ return_path }`}
              <br /><br /><br />
            </div>
          )}
          <h2>Oops! It looks like something went wrong.</h2>
          <p>We're looking into it.</p>
          <p>
            You can try closing all tabs and re-opening your browser.<br />
            If this problem continues, please contact support through the <Link href="/feedback?source=ErrorPage.other_error">Feedback Page</Link>.
          </p>
        </div>
      )}
    </L.div>
  );
};

export default SomethingWentWrong;
