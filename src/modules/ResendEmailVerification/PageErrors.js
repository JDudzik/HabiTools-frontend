import { Button, Stack } from '@mui/material';
import { Link, L } from 'components';


export const PageErrors = ({ pageError }) => (
  <>
    {pageError.status === 'ALREADY_VERIFIED_EMAIL' && (
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
            This email has already been verified
          </L.h2>
          <L.p>
            No need to do anything else! Your email has already been verified!
          </L.p>
          <Link href="/login">
            <Button
              variant="contained"
              color="primary"
            >Login Page</Button>
          </Link>
        </Stack>
      </>
    )}

    {pageError.status === 'NO_USER_WITH_EMAIL' && (
      <>
        <Stack
          maxWidth="50em"
          spacing={ 3 }
          direction="column"
          alignItems="center"
          textAlign="center"
          sx={{ paddingY: 4 }}
        >
          <L.h4 color="primary">
            This account does not exists
          </L.h4>
          <L.p>
            The email address you provided does not exist in our system. Feel free to try again.<br />
            You can also create an account in the <Link href="/sign-up">Sign-up Page</Link>
          </L.p>
          <Link href="/sign-up">
            <Button
              variant="contained"
              color="primary"
            >Sign-up Page</Button>
          </Link>
        </Stack>
      </>
    )}
  </>
);


export default PageErrors;
