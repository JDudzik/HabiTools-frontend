import { Stack, Button } from '@mui/material';
import { L } from 'components';


export const UnlinkSuccessPage = ({ onClose }) => {
  return (
    <Stack spacing={ 3 }>
      <L.div>
        <L.h3>Account Unlinked</L.h3>
        <L.p>
          Your Habitica account has been successfully unlinked. All tools have been disabled and your credentials have been permanently deleted.
        </L.p>
        <L.p sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
          You can link your account again at any time.
        </L.p>
      </L.div>

      <Stack spacing={ 2 } direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={ onClose }
        >
          Close
        </Button>
      </Stack>
    </Stack>
  );
};
