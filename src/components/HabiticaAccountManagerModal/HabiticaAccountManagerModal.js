import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
} from '@mui/material';
import { LoadingElement } from 'components';
import { useApiGetHabitica } from 'lib/api/methods/habiticaApi';
import { UnlinkedIntroPage } from './pages/UnlinkedIntroPage';
import { SecurityInfoPage } from './pages/SecurityInfoPage';
import { LinkFormPage } from './pages/LinkFormPage';
import { LinkSuccessPage } from './pages/LinkSuccessPage';
import { LinkedIntroPage } from './pages/LinkedIntroPage';
import { UnlinkConfirmationPage } from './pages/UnlinkConfirmationPage';
import { UnlinkSuccessPage } from './pages/UnlinkSuccessPage';


export const HabiticaAccountManagerModal = ({ open, onClose }) => {
  const [ currentPage, setCurrentPage ] = useState(null);

  const { data: habiticaData, isLoading } = useApiGetHabitica();

  // Determine the initial page based on link status
  const initialPage = useMemo(() => {
    if (habiticaData?.isLinked) {
      return 'linkedIntro';
    }
    return 'unlinkedIntro';
  }, [ habiticaData?.isLinked ]);

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
    setCurrentPage(null);
    onClose();
  };

  const renderPage = () => {
    if (isLoading) {
      return (
        <Stack minHeight={ 200 } alignItems="center" justifyContent="center">
          <LoadingElement circular />
        </Stack>
      );
    }

    switch (currentPage) {
      case 'unlinkedIntro':
        return <UnlinkedIntroPage onNavigate={ handleNavigate } />;
      case 'securityInfo':
        return <SecurityInfoPage onNavigate={ handleNavigate } />;
      case 'linkForm':
        return <LinkFormPage onNavigate={ handleNavigate } />;
      case 'linkSuccess':
        return <LinkSuccessPage onClose={ handleClose } />;
      case 'linkedIntro':
        return (
          <LinkedIntroPage
            habiticaUser={ habiticaData?.habiticaUser }
            onNavigate={ handleNavigate }
            onUnlinkClick={ () => handleNavigate('unlinkConfirmation') }
          />
        );
      case 'unlinkConfirmation':
        return (
          <UnlinkConfirmationPage
            onNavigate={ handleNavigate }
            onUnlinkSuccess={ () => handleNavigate('unlinkSuccess') }
          />
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
