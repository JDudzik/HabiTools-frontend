import { Switch as MuiSwitch, FormControlLabel } from '@mui/material';
import _get from 'lodash/get';


export const Switch = (props) => {
  const {
    formik,
    id,
    name,
    label,
    formikField,
    alwaysEnabled,
    disabled,
    defaultValue,
    sx,
    ...remainingProps
  } = props;

  // The many options to generate "renderedName" is just for deeper levels of control.
  // In reality, using "name" will set this formik components values as well as its "name" and "id" attributes.
  const renderedName = formikField || id || name;

  const thisValue = _get(formik.values, renderedName) ?? false;
  
  const isSubmitting = formik.isSubmitting;
  const isDisabled = disabled || (!alwaysEnabled && isSubmitting);

  return (
    <FormControlLabel
      sx={ sx }
      disabled={ isDisabled }
      control={ (
        <MuiSwitch
          id={ id || renderedName }
          name={ name || renderedName }
          checked={ thisValue }
          onChange={ e => formik.setFieldValue(renderedName, e.target.checked) }
          { ...remainingProps }
        />
      ) }
      label={ label }
    />
  );
};