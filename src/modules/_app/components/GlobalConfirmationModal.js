
import { useContext, useCallback } from 'react';
import { confirmationModalContext } from 'lib/contexts/ConfirmationModalContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from '@mui/material';

export const GlobalConfirmationModal = () => {
  const { modalState, modalDispatch } = useContext(confirmationModalContext);
  const {
    open,
    title,
    content,
    color,
    primaryButtonText,
    secondaryButtonText,
    onRequestClose,
    onRequestSubmit,
    removeSecondaryAction,
    ...remainingProps
  } = modalState.modal;

  const handleClose = useCallback(() => {
    modalDispatch({ type: 'CLOSE_MODAL' });
    if (!removeSecondaryAction && onRequestClose) {
      onRequestClose?.();
    }
    // If there is no secondary action, then closing the modal should trigger the primary action.
    if (removeSecondaryAction && onRequestSubmit) {
      onRequestSubmit?.();
    }
  }, [ modalDispatch, onRequestClose, onRequestSubmit, removeSecondaryAction ]);

  const handleSubmit = useCallback(() => {
    modalDispatch({ type: 'CLOSE_MODAL' });
    if (onRequestSubmit) {
      onRequestSubmit?.();
    }
  }, [ modalDispatch, onRequestSubmit ]);

  return (
    <Dialog
      sx={{ 
        '& .MuiPaper-root': {
          marginX: { xxs: 1, sm: '32px' },
        },
      }}
      closeAfterTransition={ false }
      open={ open }
      onClose={ handleClose }
      { ...remainingProps }
    >
      {title && (<DialogTitle>{ title }</DialogTitle>)}
      {content && (
        <DialogContent>
          { content }
        </DialogContent>
      )}
      <DialogActions>
        <Stack direction="row" justifyContent="center" flexWrap="wrap" spacing={{ xxs: 1, sm: 3 }}>
          { !removeSecondaryAction && (
            <Button
              onClick={ handleClose }
            >{secondaryButtonText || 'Cancel'}</Button>
          )}
          <Button
            color={ color }
            variant="outlined"
            onClick={ handleSubmit }
          >{primaryButtonText || 'Continue'}</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};