import { Link } from 'components';
import { Button, Stack } from '@mui/material';


export const PageErrors = ({ pageError, formFieldValues, resetForm }) => (
  <>
    {pageError.status === 'EMAIL_ALREADY_EXISTS' && (
      <div>
        <h2>Oops!</h2>
        <p>The email <b>{formFieldValues.email}</b> is already in use.</p>
        <p>If this is your email address you can try logging in, or using the password reset.</p>
        <br />

        <Stack direction="row" spacing={ 2 }>
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={ () => resetForm(false) }
          >Retry</Button><br />
          <Link href="/reset-password">
            <Button
              variant="outlined"
              color="secondary"
            >Password Reset</Button>
          </Link>
        </Stack>

      </div>
    )}

    {pageError.status === 'FAILED_TO_FETCH' && (
      <div>
        <h2>Oops!</h2>
        <p>It looks like you might be offline.</p>
        <p>Make sure you are connected to the internet and try again</p>
        <br />

        <Stack direction="row" spacing={ 2 }>
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={ () => resetForm(false) }
          >Retry</Button>
          <Link href="/login">
            <Button
              variant="contained"
              color="secondary"
            >Login</Button>
          </Link>
        </Stack>
      </div>
    )}

    {pageError.status === 'OTHER_ERROR' && (
      <div>
        <h2>Oops! It looks like something went wrong.</h2>
        <p>We're looking into it.</p>
        <p>
          You can try closing all tabs and re-opening your browser.<br />
          If this problem continues, please contact support through the <Link href="/feedback">Feedback Page</Link>
        </p>
        <br />

        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={ () => resetForm(false) }
        >Retry</Button>
      </div>
    )}
  </>
);


export default PageErrors;
