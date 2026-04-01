import { Link } from 'components';
import {
  Button,
  Stack,
} from '@mui/material';


export const PageErrors = ({ pageError, heldEmail }) => (
  <Stack
    marginBottom="2em"
  >
    {pageError.status === 'USER_IS_DELETED' && (
      <>
        <h2>This Account Has Been Deleted</h2>
        <p>
          The account you have attempted to log into has been deleted from the system.<br />
          You can sign up for a new account from the <Link href="/sign-up">Sign-up Page</Link>.<br />
          Please be aware that you will be unable to use this same email address as it was already registered.
        </p>
      </>
    )}


    {pageError.status === 'INVALID_CREDENTIALS' && (
      <>
        <h2>Incorrect Email and Password Combination</h2>
        <p>
          The email and password combination that you provided is incorrect.<br />
          You can reset your password from the <Link href="/forgot-password">Forgot Password page</Link>
        </p>
      </>
    )}


    {pageError.status === 'UNVERIFIED_EMAIL' && (
      <>
        <h2>You Must Verify Your Email</h2>
        <p>
          You have not verified your email address yet! We've already sent you an email with further instructions
          to finish creating your account.
        </p>
        <p>Would you like to resend the instructions to your email address?</p>
        <Link href={ `/resend-email-verification?email=${ heldEmail }` }>
          <Button
            variant="contained"
            color="secondary"
          >Resend Email Verification</Button>
        </Link>
        <br /><br />
      </>
    )}
  </Stack>
);


export default PageErrors;
