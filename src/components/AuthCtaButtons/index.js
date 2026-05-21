import { Link } from 'components';
import {
  Stack,
  Button,
} from '@mui/material';


export const AuthCtaButtons = (props) => {
  const { handleClick, returnPath } = props;

  return (
    <Stack
      spacing={{ xxs: 1.5, sm: 2 }}
      direction={{ xxs: 'column', sm: 'row' }}
      sx={{
        justifyContent: { xxs: 'center', md: 'flex-start' }, // Align buttons with text
        alignItems: { xxs: 'center', sm: 'flex-start' }, // Center buttons vertically on mobile
      }}
    >
      <Link href="/sign-up" >
        <Button
          variant="contained"
          size="large" 
          sx={{
            transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 6,
            },
          }}
          onClick={ () => handleClick?.({ button: 'sign-up' }) }
        >
          Sign-up
        </Button>
      </Link>
      <Link href={ `/login${ returnPath ? `?return_path=${ encodeURIComponent(returnPath) }` : '' }` } >
        <Button 
          variant="outlined" 
          size="large"
          sx={{
            transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 3,
            },
          }}
          onClick={ () => handleClick?.({ button: 'login' }) }
        >
          Login
        </Button>
      </Link>
    </Stack>
  );
};