import { useMemo, useState, useContext } from 'react';
import { L, VirtualizedTableSimple, MarkdownMui, SquareIconButton } from 'components';
import {
  Stack,
  Box,
} from '@mui/material';
import { useApiListEventMessages } from 'lib/api/methods/eventMessageApi';
import { userContext } from 'lib/contexts/UserContext';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


export const ToolEventMessagesTable = (props) => {
  const {
    activeToolInstance,
    toolSlug,
  } = props;
  
  const { userState } = useContext(userContext);
  const [ currentMessagesPage, setCurrentMessagesPage ] = useState(1);

  const { data: eventMessagesData, isLoading: isLoadingMessages } = useApiListEventMessages(
    {
      filters: {
        resource_id: activeToolInstance?.id,
      },
      pagination: {
        page: currentMessagesPage,
        page_size: 50,
      },
    },
    {
      enabled: userState?.isLoggedIn && !!activeToolInstance?.id,
      instance: `${ toolSlug }`,
    },
  );
  const totalMessagesPages = eventMessagesData?.pagination?.totalPages || 1;

  const memoizedMessageRows = useMemo(() => {
    return eventMessagesData?.messages?.map?.(message => ({
      columns: [
        { key: 'timestamp', element: new Date(parseInt(message.created_at, 10)).toLocaleString() },
        { key: 'event', element: (
          <L.p fontSize="small">
            <strong>{ message.event_name || message.event_slug || 'Unknown Event' }</strong>
          </L.p>
        ) },
        { key: 'message', element: (
          <Box fontSize="small">
            { MarkdownMui.compiler(message.message_text || message.short_message || '') }
          </Box>
        ) },
      ],
    })) || [];
  }, [ eventMessagesData?.messages ]);


  return (
    <VirtualizedTableSimple
      size="small"
      height={{ xxs: '40vh', sm: '50vh', md: '55vh' }}
      isLoading={ isLoadingMessages }
      title="Event History"
      subtitle={ (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={ 1 }
        >
          <SquareIconButton
            aria-label="Previous list of notifications"
            color="secondary"
            variant="contained"
            icon={ <ArrowBackIosNewIcon /> }
            disabled={ totalMessagesPages <= 1 || currentMessagesPage === 1 }
            onClick={ () => setCurrentMessagesPage(currentMessagesPage - 1) }
          />
          <L.p sx={{ color: 'text.white', userSelect: 'none' }}>{ currentMessagesPage }</L.p>
          <SquareIconButton
            aria-label="Next list of notifications"
            color="secondary"
            variant="contained"
            icon={ <ArrowForwardIosIcon /> }
            disabled={ totalMessagesPages <= 1 || currentMessagesPage >= totalMessagesPages }
            onClick={ () => setCurrentMessagesPage(currentMessagesPage + 1) }
          />
        </Stack>
      ) }
      noDataMessage={ activeToolInstance ? 'No events recorded yet' : 'Activate the tool to see event history.' }
      headers={ [
        { label: 'Time', key: 'timestamp', width: '5rem' },
        { label: 'Event', key: 'event', width: '6rem' },
        { label: 'Message', key: 'message', width: '15rem' },
      ] }
      rows={ memoizedMessageRows }
    />
  );
};