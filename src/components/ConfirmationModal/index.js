import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from '@mui/material';


export const ConfirmationModal = (props) => {
  const {
    open,
    title,
    children,
    confirmText,
    closeText,
    removeSecondaryAction,
    confirmOnClick,
    confirmDisabled,
    onClose,
    closeOnConfirm = true,
    modalProps,
  } = props;

  const handleClose = () => {
    if (!removeSecondaryAction) {
      onClose();
    } else {
      confirmText();
    }
  };

  const handleConfirm = () => {
    if (closeOnConfirm) {
      onClose();
    }
    confirmOnClick?.();
  };

  return (
    <Dialog
      sx={{ 
        '& .MuiPaper-root': {
          marginX: { xxs: 1, sm: '32px' },
        },
      }}
      open={ open }
      onClose={ handleClose }
      { ...modalProps }
    >
      {title && (<DialogTitle>{title}</DialogTitle>)}
      {children && (
        <DialogContent>
          {children}
        </DialogContent>
      )}
      <DialogActions>
        <Stack direction="row" justifyContent="center" flexWrap="wrap" spacing={{ xxs: 1, sm: 3 }}>
          {!removeSecondaryAction && (
            <Button
              onClick={ handleClose }
            >{closeText || 'Cancel'}</Button>
          )}
          <Button
            disabled={ confirmDisabled }
            onClick={ handleConfirm }
          >{confirmText || 'Confirm'}</Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
  