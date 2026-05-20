import { Stack, Button } from '@mui/material';
import { L } from 'components';


export const UnlinkedIntroPage = ({ openHowWeSecureModal, onNavigate }) => {
  return (
    <Stack spacing={ 3 }>
      <L.div>
        <L.p>
          To use HabiTools, you need to link your Habitica account. This allows us to safely
          connect your account so our tools can help automate your Habitica experience.
        </L.p>
        <L.p sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
          We keep your information secure and encrypted. Learn more about our security practices below.
        </L.p>
      </L.div>

      <Stack spacing={ 2 } direction="row" justifyContent="flex-end">
        <Button
          variant="text"
          onClick={ openHowWeSecureModal }
        >
          Learn how we keep your data secure
        </Button>
      </Stack>

      <Stack spacing={ 2 } direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={ () => onNavigate('linkForm') }
        >
          Get Started
        </Button>
      </Stack>
    </Stack>
  );
};
