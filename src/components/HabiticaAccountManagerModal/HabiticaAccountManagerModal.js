import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
} from '@mui/material';
import { LoadingElement, MarkdownMui } from 'components';
import { useConfirmationModal } from 'lib/hooks';
import { useApiGetHabitica } from 'lib/api/methods/habiticaApi';
import { UnlinkedIntroPage } from './pages/UnlinkedIntroPage';
import { LinkFormPage } from './pages/LinkFormPage';
import { LinkSuccessPage } from './pages/LinkSuccessPage';
import { LinkedIntroPage } from './pages/LinkedIntroPage';
import { UnlinkConfirmationPage } from './pages/UnlinkConfirmationPage';
import { UnlinkSuccessPage } from './pages/UnlinkSuccessPage';
import howWeSecure from 'lib/data/howWeSecure.md';


export const HabiticaAccountManagerModal = ({ open, onClose }) => {
  const { openConfirmation } = useConfirmationModal();
  const [ currentPage, setCurrentPage ] = useState(null);

  const { data: habiticaData, isLoading } = useApiGetHabitica({ skipRefresh: true });

  // Determine the initial page based on link status
  const initialPage = useMemo(() => {
    if (habiticaData?.id) {
      return 'linkedIntro';
    }
    return 'unlinkedIntro';
  }, [ habiticaData?.id ]);

  // Set initial page when dialog opens
  useEffect(() => {
    if (open && !currentPage) {
      setCurrentPage(initialPage);
    }
  }, [ open, currentPage, initialPage ]);

  const handleNavigate = (page) => {
    setCurrentPage(page || initialPage);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setCurrentPage(null);
    }, 500); // Delay to allow dialog close animation to finish
  };

  const openHowWeSecureModal = () => {
    openConfirmation({
      content: (<MarkdownMui.Markdown text={ howWeSecure } />),
      primaryButtonText: 'Close',
      removeSecondaryAction: true,
    });
  };

  const renderPage = () => {
    if (isLoading) {
      return (
        <Stack minHeight={ 200 } alignItems="center" justifyContent="center">
          <LoadingElement circular visibilityDelay={ 0 } />
        </Stack>
      );
    }

    switch (currentPage) {
      case 'unlinkedIntro':
        return <UnlinkedIntroPage openHowWeSecureModal={ openHowWeSecureModal } onNavigate={ handleNavigate } />;
      case 'linkForm':
        return <LinkFormPage onNavigate={ handleNavigate } />;
      case 'linkSuccess':
        return <LinkSuccessPage onClose={ handleClose } />;
      case 'linkedIntro':
        return (
          <LinkedIntroPage
            habiticaUser={ habiticaData }
            openHowWeSecureModal={ openHowWeSecureModal }
            onNavigate={ handleNavigate }
          />
        );
      case 'unlinkConfirmation':
        return (
          <UnlinkConfirmationPage onNavigate={ handleNavigate } />
        );
      case 'unlinkSuccess':
        return <UnlinkSuccessPage onClose={ handleClose } />;
      default:
        return null;
    }
  };

  return (
    <Dialog
      fullWidth
      open={ open }
      maxWidth="sm"
      sx={{
        '& .MuiPaper-root': {
          marginX: { xxs: 1, sm: '32px' },
        },
      }}
      onClose={ handleClose }
    >

      {isLoading && <DialogTitle>Loading Habitica Account</DialogTitle>}
      <DialogContent>
        {renderPage()}
      </DialogContent>
    </Dialog>
  );
};
