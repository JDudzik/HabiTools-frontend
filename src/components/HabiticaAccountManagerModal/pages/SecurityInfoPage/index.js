import { Stack, Button } from '@mui/material';
import { L } from 'components';


export const SecurityInfoPage = ({ onNavigate }) => {
  return (
    <Stack spacing={ 3 }>
      <L.h3>How We Keep Your Data Secure</L.h3>

      <L.div>
        <L.h4>Encryption</L.h4>
        <L.p>
          Your Habitica API key is encrypted using industry-standard encryption algorithms before being stored in our database. This ensures that even our team cannot read your credentials in plain text.
        </L.p>
      </L.div>

      <L.div>
        <L.h4>Limited Access</L.h4>
        <L.p>
          Your credentials are only used to make API calls to Habitica on your behalf. We never share your information with third parties.
        </L.p>
      </L.div>

      <L.div>
        <L.h4>Data Minimization</L.h4>
        <L.p>
          We only store the information needed to operate our tools. You can unlink your account at any time, which immediately deletes all stored credentials.
        </L.p>
      </L.div>

      <Stack spacing={ 2 } direction="row" justifyContent="flex-start">
        <Button
          variant="outlined"
          onClick={ () => onNavigate('unlinkedIntro') }
        >
          Back
        </Button>
      </Stack>
    </Stack>
  );
};
