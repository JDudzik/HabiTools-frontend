import { Stack, Button } from '@mui/material';
import { L } from 'components';


export const LinkSuccessPage = ({ onClose }) => {
  return (
    <Stack spacing={ 3 }>
      <L.div>
        <L.h3>All Set!</L.h3>
        <L.p>
          Your Habitica account has been successfully linked. You can now start using HabiTools to automate your Habitica experience.
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
