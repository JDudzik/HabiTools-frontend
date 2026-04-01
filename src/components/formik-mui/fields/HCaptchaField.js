import { Typography } from '@mui/material';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import _get from 'lodash/get';

export const HCaptchaField = (props) => {
  const {
    formik,
    name,
    alwaysEnabled,
    disabled,
    sitekey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY,
    ...remainingProps
  } = props;

  const thisError = _get(formik.errors, name);
  const hasAttemptedSubmit = formik.submitCount > 0;
  const hasError = hasAttemptedSubmit && Boolean(thisError);

  return (
    <div>
      <HCaptcha
        sitekey={ sitekey }
        onVerify={ token => formik.setFieldValue(name, token) }
        { ...remainingProps }
      />
      {hasError && (
        <Typography variant="caption" color="error">
          {thisError}
        </Typography>
      )}
    </div>
  );
};