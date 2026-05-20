import { Stack, Button } from '@mui/material';
import { L } from 'components';
import { useMutateUnlinkHabitica } from 'lib/api/methods/habiticaApi';
import { useConfirmationModal } from 'lib/hooks/useConfirmationModal';


export const UnlinkConfirmationPage = ({ onNavigate }) => {
  const { openConfirmation } = useConfirmationModal();
  const { mutate: mutateUnlinkHabitica, isPending: isUnlinking } = useMutateUnlinkHabitica();

  const handleConfirmUnlink = () => {
    mutateUnlinkHabitica(undefined, {
      onSuccess: () => {
        onNavigate('unlinkSuccess');
      },
      onError: () => {
        openConfirmation({
          title: 'Error',
          content: 'Failed to unlink your Habitica account. Please try again.',
          primaryButtonText: 'Okay',
          removeSecondaryAction: true,
        });
      },
    });
  };

  return (
    <Stack spacing={ 3 }>
      <L.div>
        <L.h3>Unlink Your Habitica Account?</L.h3>
        <L.p>
          Unlinking your Habitica account will:
        </L.p>
        <ul>
          <li>Disable all active tools</li>
          <li>Delete your stored Habitica credentials</li>
          <li>Remove your Habitica user data from our servers</li>
        </ul>
        <L.p sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
          You can link your account again at any time if you change your mind.
        </L.p>
      </L.div>

      <Stack spacing={ 2 } direction="row" justifyContent="flex-end">
        <Button
          variant="outlined"
          disabled={ isUnlinking }
          onClick={ () => onNavigate('linkedIntro') }
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          disabled={ isUnlinking }
          onClick={ handleConfirmUnlink }
        >
          {isUnlinking ? 'Unlinking...' : 'Unlink Account'}
        </Button>
      </Stack>
    </Stack>
  );
};
