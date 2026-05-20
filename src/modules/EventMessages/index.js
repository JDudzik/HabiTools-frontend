import { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { PageHead, L, VirtualizedTableSimple, SquareIconButton, MarkdownMui } from 'components';
import { usePageManager } from 'lib/hooks';
import {
  Stack,
  Box,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { userContext } from 'lib/contexts/UserContext';
import { useQueryClient } from '@tanstack/react-query';
import { useApiListEventMessages, useMutateAcknowledgeEventMessages } from 'lib/api/methods/eventMessageApi';
import { SubtitleControls, TitleControls } from './components';


const Notifications = () => {
  const { userState } = useContext(userContext);
  const queryClient = useQueryClient();
  const [ selectedMessage, setSelectedMessage ] = useState();
  const [ currentMessagesPage, setCurrentMessagesPage ] = useState(1);
  const [ viewOnlyUnread, setViewOnlyUnread ] = useState(true);
  const {
    mutate: mutateAcknowledgeEventMessages,
    isLoading: isLoadingAcknowledge,
    error: acknowledgeError,
  } = useMutateAcknowledgeEventMessages({ instance: 'global_notifications' });

  const { data: eventMessages, isLoading: isLoadingEventMessages, error: eventMessagesError } = useApiListEventMessages({
    filters: {
      should_notify: true,
      acknowledged: viewOnlyUnread ? false : undefined,
    },
    pagination: {
      page_size: 100,
      page: currentMessagesPage || 1,
    },
  }, {
    enabled: userState?.isLoggedIn,
    instance: 'global_notifications',
  });
  const onlyUnreadMessages = eventMessages?.messages?.filter(message => !message.acknowledged);

  const acknowledgeAllMessages = () => {
    const allIds = onlyUnreadMessages.map(message => message.id);
    mutateAcknowledgeEventMessages({ message_ids: allIds });
  };

  const {
    openConfirmation,
  } = usePageManager({
    defaultHandleApiError: {
      returnPath: '/notifications',
      handledErrors: [],
    },
    apiErrors: acknowledgeError || eventMessagesError,
  });

  useEffect(() => {
    if (selectedMessage) {
      openConfirmation({
        content: (
          <Stack spacing={ 2 }>
            <L.h1 color={ selectedMessage.priority === 3 ? 'warning' : 'primary.veryDark' }>
              {selectedMessage.event_name}
              {selectedMessage.priority === 3 && <span> - High Priority</span>}
            </L.h1>
            
            <Box>
              { MarkdownMui.compiler(selectedMessage.message_text) }
            </Box>
          </Stack>
        ),
        primaryButtonText: !selectedMessage.acknowledged ? (
          <>
            <CheckCircleOutlineIcon sx={{ mx: 0.5 }} />
            Mark as Read
          </>
        ) : 'Close',
        onRequestSubmit: () => {
          setSelectedMessage(null);
          if (!selectedMessage.acknowledged) {
            mutateAcknowledgeEventMessages({ message_ids: [ selectedMessage.id ]});
          }
        },
        removeSecondaryAction: selectedMessage.acknowledged,
        secondaryButtonText: 'Close',
        onRequestClose: () => setSelectedMessage(null),
      });
    }
  }, [ openConfirmation, selectedMessage, mutateAcknowledgeEventMessages ]);

  const refreshNotifications = useCallback(() => {
    queryClient.refetchQueries({ queryKey: [ 'useApiListEventMessages', 'global_notifications' ]});
  }, [ queryClient ]);

  // When this page first opens, refresh notifications.
  useEffect(() => {
    refreshNotifications();
  }, [ refreshNotifications ]);

  const memoizedRowData = useMemo(() => {
    return eventMessages?.messages.map?.(eventMessage => ({
      onClick: () => { setSelectedMessage(eventMessage); },
      columns: [
        { key: eventMessage.id, element: new Date(parseInt(eventMessage.created_at, 10)).toLocaleString() },
        { key: eventMessage.short_message, element: (
          <Box
            color={ eventMessage.priority === 3 ? 'warning' : undefined }
            onClick={ () => { setSelectedMessage(eventMessage); } }
          >
            { MarkdownMui.compiler(eventMessage.short_message) }
          </Box>
        ) },
        { key: 'acknowledge-button', element: (
          <SquareIconButton
            aria-label="Acknowledge message"
            color="primary"
            disabled={ eventMessage.acknowledged }
            icon={ <CheckCircleOutlineIcon /> }
            onClick={ (e) => {
              e.stopPropagation();
              mutateAcknowledgeEventMessages({ message_ids: [ eventMessage.id ]});
            } }
          />
        ), align: 'right' },
      ],
    }));
  }, [ eventMessages?.messages, mutateAcknowledgeEventMessages ]);

  return (
    <>
      <PageHead title="Notifications" />
      <Stack flexDirection="column" sx={{ width: '100%' }}>
        <L.section>
          <VirtualizedTableSimple
            size="small"
            height={{ xxs: '50vh', sm: '60vh', md: '65vh' }}
            isLoading={ isLoadingEventMessages || isLoadingAcknowledge }
            title={ (
              <TitleControls
                text={ viewOnlyUnread ? 'Unread Notifications' : 'All Notifications' }
                disabled={ !onlyUnreadMessages?.length }
                acknowledgeAllMessages={ acknowledgeAllMessages }
              />
            ) }
            subtitle={ (
              <SubtitleControls
                setCurrentPage={ setCurrentMessagesPage }
                totalPages={ eventMessages?.pagination?.totalPages || 1 }
                viewOnlyUnread={ viewOnlyUnread }
                setViewOnlyUnread={ setViewOnlyUnread }
                refreshNotifications={ refreshNotifications }
              />
            ) }
            noDataMessage={ viewOnlyUnread ? 'You don\'t have any unread notifications' : 'You don\'t have any notifications' }
            noDataIcon={ CheckCircleOutlineIcon }
            headers={ [{
              label: 'Time',
              key: 'time',
              width: '7rem',
            }, {
              label: 'Subject',
              key: 'subject',
              width: '20rem',
            }, {
              label: 'Acknowledge',
              key: 'acknowledge',
              width: '6rem',
              align: 'right',
            }] }
            rows={ memoizedRowData }
          />
        </L.section>
      </Stack>
    </>
  );
};

export default Notifications;