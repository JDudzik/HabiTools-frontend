import { useEffect, useContext } from 'react';
import { IconButton, Stack } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { navigationContext } from 'lib/contexts/NavigationContext';
import { MarkdownMui } from 'components';
import { useApiGetArticle } from 'lib/api/methods/articleApi';


export const SystemAlertMessage = () => {
  const { navigationState, navigationDispatch } = useContext(navigationContext);

  const { data: systemAlertArticle } = useApiGetArticle({
    slug: 'system-alert',
    refetchInterval: 600000, // 10 minutes
    staleTime: 600000, // 10 minutes
    gcTime: 604800000, // 7 days
  });
  const alertMessage = systemAlertArticle && systemAlertArticle.content && systemAlertArticle.content.content;
  const shouldDisplay = navigationState?.options?.systemAlertOpen && !!alertMessage;

  useEffect(() => {
    navigationDispatch({
      type: 'TOGGLE_OPTION',
      payload: { option: 'showSystemAlertButton', setTo: !!alertMessage },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ alertMessage ]);

  const handleClose = () => navigationDispatch({
    type: 'TOGGLE_OPTION',
    payload: { option: 'systemAlertOpen', setTo: false },
  });

  return shouldDisplay ? (
    <Stack
      sx={{
        alignItems: 'flex-start',
        backgroundColor: 'warning.main',
        justifyContent: 'space-between',
        flexDirection: 'row',
        maxHeight: '15vh',
        overflowY: 'auto',
      }}
    >
      <MarkdownMui.Markdown>{ alertMessage }</MarkdownMui.Markdown>
      <IconButton
        aria-label="close"
        sx={{
          color: 'text.black',
          textAlign: 'center',
          paddingTop: 0.75,
        }}
        onClick={ handleClose }
      >
        <CloseIcon />
      </IconButton>
    </Stack>
  ) : null;
};
