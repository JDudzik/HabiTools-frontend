import { useMutateSendGlobalHabiticaNotification } from 'lib/api/methods/habiticaApi';
import { useConfirmationFormModal } from '../hooks/useConfirmationFormModal';
import {
  Stack,
  TextField,
  Alert,
  MenuItem,
} from '@mui/material';
import { L, SimpleDisplay, MarkdownMui } from 'components';


const GLOBAL_HABITICA_NOTIFICATION_PERMISSION = 'global_habitica_notification';

const PRIORITY_OPTIONS = [
  { value: 0, label: '0 - Debug' },
  { value: 1, label: '1 - Normal' },
  { value: 2, label: '2 - High' },
  { value: 3, label: '3 - Severe' },
];

const handledErrors = [
  'MISSING_FIELDS',
  'INVALID_PROPERTY_VALUE',
  'INADEQUATE_PERMISSION',
  'GLOBAL_HABITICA_NOTIFICATION_FAILED',
];


export const useGlobalHabiticaNotificationMenuAction = ({
  userState,
  openConfirmation,
  updateConfirmation,
  handleApiError,
}) => {
  const { openFormModal } = useConfirmationFormModal({ openConfirmation, updateConfirmation });
  const { mutate: sendGlobalNotification } = useMutateSendGlobalHabiticaNotification();

  const hasGlobalHabiticaNotificationPermission = userState?.permissionsCheck?.has?.(GLOBAL_HABITICA_NOTIFICATION_PERMISSION);

  const openInfoModal = (title, message) => {
    openConfirmation({
      title,
      content: <L.p>{ message }</L.p>,
      primaryButtonText: 'Close',
      removeSecondaryAction: true,
    });
  };

  const openGlobalHabiticaNotificationModal = () => {
    openFormModal({
      title: 'Global Habitica Notification',
      secondaryButtonText: 'Cancel',
      initialState: {
        message_text: '',
        short_message: '',
        event_name: '',
        priority: 2,
      },
      getPrimaryButtonText: () => 'Review Notification',
      onSubmit: (currentState) => {
        if (!currentState?.message_text) {
          openInfoModal('Missing Message Text', 'Please provide message text before continuing.');
          return;
        }

        const payload = {
          message_text: currentState?.message_text,
          short_message: currentState?.short_message,
          event_name: currentState?.event_name,
          priority: currentState?.priority,
        };

        openConfirmation({
          color: 'warning',
          title: 'Confirm Global Habitica Notification',
          secondaryButtonText: 'Back',
          primaryButtonText: 'Send To All Linked Users',
          content: (
            <Stack spacing={ 2 } mt={ 1 }>
              <Alert severity="warning">
                This will send a private message to ALL users with linked Habitica accounts.
              </Alert>

              <SimpleDisplay title="Event Name" sx={{ flexGrow: 1, m: 0.5 }} color="secondary.main">
                { currentState?.event_name || 'Important Message from HabiTools' }
              </SimpleDisplay>

              <SimpleDisplay title="Short Message" sx={{ flexGrow: 1, m: 0.5 }} color="secondary.main">
                { currentState?.short_message || 'Important Message from HabiTools' }
              </SimpleDisplay>

              <SimpleDisplay title="Priority" sx={{ flexGrow: 1, m: 0.5 }} color="secondary.main">
                { currentState?.priority }
              </SimpleDisplay>

              <SimpleDisplay title="Rendered Markdown" sx={{ flexGrow: 1, m: 0.5 }} color="secondary.main">
                <Stack sx={{ px: 1, py: 0.5 }}>
                  <MarkdownMui.Markdown>
                    { currentState?.message_text }
                  </MarkdownMui.Markdown>
                </Stack>
              </SimpleDisplay>
            </Stack>
          ),
          onRequestSubmit: () => {
            sendGlobalNotification(payload, {
              onSuccess: (result) => {
                openConfirmation({
                  title: 'Global Habitica Notification Sent',
                  content: (
                    <Stack spacing={ 1 } mt={ 1 }>
                      <L.p>
                        Notification has been sent to all linked Habitica users.
                      </L.p>
                      <L.p>
                        users targeted: { result?.sent_count ?? 0 }
                      </L.p>
                    </Stack>
                  ),
                  primaryButtonText: 'Close',
                  removeSecondaryAction: true,
                });
              },
              onError: (error) => {
                handleApiError({ error, handledErrors });
              },
            });
          },
        });
      },
      renderContent: (modalState, handleChange) => (
        <Stack spacing={ 2 } mt={ 1 }>
          <TextField
            required
            multiline
            minRows={ 6 }
            size="small"
            label="Message Text"
            placeholder="Write markdown-supported message text"
            value={ modalState?.message_text || '' }
            onChange={ event => handleChange({ message_text: event.target.value }) }
          />

          <TextField
            size="small"
            label="Short Message"
            placeholder="Optional short summary"
            value={ modalState?.short_message || '' }
            onChange={ event => handleChange({ short_message: event.target.value }) }
          />

          <TextField
            size="small"
            label="Event Name"
            placeholder="Optional event name"
            value={ modalState?.event_name || '' }
            onChange={ event => handleChange({ event_name: event.target.value }) }
          />

          <TextField
            select
            size="small"
            label="Priority"
            value={ modalState?.priority ?? 2 }
            onChange={ event => handleChange({ priority: Number(event.target.value) }) }
          >
            { PRIORITY_OPTIONS.map(option => (
              <MenuItem key={ option.value } value={ option.value }>
                { option.label }
              </MenuItem>
            )) }
          </TextField>
        </Stack>
      ),
    });
  };

  
  if (!hasGlobalHabiticaNotificationPermission) {
    return null;
  }

  return {
    key: 'send-global-habitica-notification',
    text: 'Send Global Habitica Notification',
    onClick: () => openGlobalHabiticaNotificationModal(),
    props: { dense: true },
  };
};