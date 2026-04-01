import { Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export const FormButton = (props) => {
  const {
    formik,
    children,
    // type,
    disabled,
    alwaysEnabled = false,
    isSubmit = true,
    allowCleanSubmit = false,
    ...remainingProps
  } = props;

  const isDirty = allowCleanSubmit || formik.dirty;
  const isSubmitting = formik.isSubmitting;

  const isDisabled = disabled || (!alwaysEnabled && (!isDirty || isSubmitting));
  const isLoading = isSubmit && isSubmitting;
  
  return (
    <Button
      type={ isSubmit ? 'submit' : 'button' }
      disabled={ isDisabled }
      variant="contained"
      color="primary"
      loading={ isLoading }
      loadingPosition={ isSubmit ? 'end' : undefined }
      endIcon={ isSubmit ? <SendIcon /> : undefined }
      { ...remainingProps }
    >
      {children}
    </Button>
  );
};
