import { TextField as MuiTextField } from '@mui/material';
import _get from 'lodash/get';


export const TextField = (props) => {
  const {
    formik,
    id,
    name,
    label,
    formikField,
    alwaysEnabled,
    disabled,
    sx,
    ...remainingProps
  } = props;
  
  // The many options to generate "renderedName" is just for deeper levels of control.
  // In reality, using "name" will set this formik components values as well as its "name" and "id" attributes.
  const renderedName = formikField || id || name;

  const thisValue = _get(formik.values, renderedName);
  const thisTouched = _get(formik.touched, renderedName);
  const thisError = _get(formik.errors, renderedName);

  const hasError = thisTouched && Boolean(thisError);
  const thisHelperText = thisTouched && thisError;
  
  const isSubmitting = formik.isSubmitting;
  const isDisabled = disabled || (!alwaysEnabled && isSubmitting);

  return (
    <MuiTextField
      type="text"
      id={ id || renderedName }
      name={ name || renderedName }
      label={ label }
      value={ thisValue }
      error={ hasError }
      helperText={ thisHelperText }
      disabled={ isDisabled }
      sx={{
        width: '100%',
        ...sx,
      }}
      onChange={ formik.handleChange }
      { ...remainingProps }
    />
  );
};