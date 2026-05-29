import { Stack, Button } from '@mui/material';
import { L } from 'components';


export const UnlinkedIntroPage = ({ openHowWeSecureModal, onNavigate }) => {
  return (
    <Stack spacing={ 3 }>
      <L.p>
        To use HabiTools, you need to link your Habitica account. This allows us to safely connect
        your account so you can use tools and automations. To do this, we must store your Habitica user ID and API key.
      </L.p>
      <L.p sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
        We keep your information secure and encrypted. Learn more about our security practices below.
      </L.p>

      <Stack spacing={ 2 } direction="row" justifyContent="flex-start">
        <Button onClick={ openHowWeSecureModal }>
          Learn how we keep your data secure
        </Button>
      </Stack>

      <Stack spacing={ 2 } direction="row" justifyContent="flex-start">
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
