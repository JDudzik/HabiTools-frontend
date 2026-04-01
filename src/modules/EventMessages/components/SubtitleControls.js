import { useState } from 'react';
import { L, SquareIconButton } from 'components';
import { useTimer } from 'lib/hooks';
import {
  Button,
  Stack,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import RefreshIcon from '@mui/icons-material/Refresh';


export const SubtitleControls = ({ setCurrentPage, totalPages, viewOnlyUnread, setViewOnlyUnread, refreshNotifications }) => {
  const [ internalMessagesPage, setInternalMessagesPage ] = useState(1);
  const { isTimerActive, activateTimer } = useTimer(3);

  const handlePageChange = (newPage) => {
    setInternalMessagesPage(newPage);
    setCurrentPage(newPage);
  };

  const handleViewChange = (onlyUnread) => {
    setViewOnlyUnread(onlyUnread);
    handlePageChange(1);
  };

  const handleRefresh = () => {
    activateTimer();
    refreshNotifications();
  };

  return (
    <Stack mt={ 2 } direction={{ xxs: 'column', xs: 'row' }} spacing={ 2 } justifyContent="space-between" alignItems="center" width="100%">
      <Stack direction={{ xxs: 'column-reverse', xs: 'row' }} spacing={ 1 }>
        <Stack direction="row">
          <Button
            sx={{ borderRadius: 0 }}
            variant="contained"
            disabled={ viewOnlyUnread }
            color="secondary"
            onClick={ () => handleViewChange(true) }
          >Unread</Button>
          <Button
            sx={{ borderRadius: 0 }}
            variant="contained"
            disabled={ !viewOnlyUnread }
            color="secondary"
            onClick={ () => handleViewChange(false) }
          >All</Button>
        </Stack>
        <SquareIconButton
          aria-label="Refresh list of notifications"
          color="secondary"
          variant="contained"
          icon={ <RefreshIcon /> }
          disabled={ isTimerActive }
          onClick={ () => handleRefresh() }
        />
      </Stack>

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
          disabled={ internalMessagesPage === 1 }
          onClick={ () => handlePageChange(internalMessagesPage - 1) }
        />
        <L.p sx={{ color: 'text.white', userSelect: 'none' }}>{ internalMessagesPage }</L.p>
        <SquareIconButton
          aria-label="Next list of notifications"
          color="secondary"
          variant="contained"
          icon={ <ArrowForwardIosIcon /> }
          disabled={ internalMessagesPage >= totalPages }
          onClick={ () => handlePageChange(internalMessagesPage + 1) }
        />
      </Stack>
    </Stack>

  );
};