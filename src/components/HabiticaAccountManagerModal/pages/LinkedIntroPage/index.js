import { Stack, Button, Typography, Link } from '@mui/material';
import { L } from 'components';



export const LinkedIntroPage = ({ habiticaUser, onNavigate, openHowWeSecureModal }) => {
  const username = habiticaUser?.habitica_user_data?.username || 'Habitica User';
  const toolCount = habiticaUser?.habitica_tools?.length || 0;

  return (
    <Stack spacing={ 3 }>
      <L.h3>Your Habitica Account</L.h3>

      <Stack spacing={ 2 } sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
        <L.div>
          <Typography variant="caption" color="text.secondary">
            Username
          </Typography>
          <L.p sx={{ m: 0 }}>
            {username}
          </L.p>
        </L.div>

        <L.div>
          <Typography variant="caption" color="text.secondary">
            Active Tools
          </Typography>
          <L.p sx={{ m: 0 }}>
            {toolCount === 0 ? 'No active tools' : `${ toolCount } active ${ toolCount === 1 ? 'tool' : 'tools' }`}
          </L.p>
        </L.div>

        <Link
          href={ `https://habitica.com/profile/${ habiticaUser?.habitica_user_id }` }
          target="_blank"
          rel="noopener noreferrer"
          variant="body2"
        >
          View Your Profile →
        </Link>
      </Stack>

      <Stack spacing={ 2 } direction="row" justifyContent="space-between" flexWrap="wrap">
        <Button onClick={ openHowWeSecureModal }>
          Learn how we keep your data secure
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={ () => onNavigate('unlinkConfirmation') }
        >
          Unlink Habitica Account
        </Button>
      </Stack>
    </Stack>
  );
};
