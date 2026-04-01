import { useState } from 'react';
import {
  Autocomplete,
  Chip,
  TextField as MuiTextField,
} from '@mui/material';


export const ChipAutocomplete = (props) => {
  const {
    formik,
    id,
    name,
    label,
    options,
    fieldProps,
    freeSolo,
    chipProps,
    placeholder,
    autocompleteProp,
  } = props;
  const [ inputValue, setInputValue ] = useState('');
  const renderedName = id || name;

  const thisValue = formik.values[renderedName];
  const hasError = formik.touched[renderedName] && Boolean(formik.errors[renderedName]);
  const thisHelperText = formik.touched[renderedName] && formik.errors[renderedName];

  const { setValue } = formik.getFieldHelpers(renderedName);

  return (
    <Autocomplete
      multiple
      freeSolo={ freeSolo }
      id={ id }
      options={ options || [] }
      value={ thisValue }
      inputValue={ inputValue }
      renderValue={ (value, getItemProps) => (
        value.map((option, index) => (
          <Chip
            key={ option }
            sx={{ backgroundColor: 'secondary.light', color: 'text.black' }}
            variant="outlined"
            label={ option }
            { ...chipProps }
            { ...getItemProps({ index }) }
          />
        ))
      ) }
      renderInput={ params => (
        <MuiTextField
          { ...params }
          label={ label }
          placeholder={ placeholder }
          error={ hasError }
          helperText={ (thisHelperText) || '' }
          slotProps={{
            htmlInput: {
              enterkeyhint: params?.inputProps?.value && 'enter',
              ...params?.inputProps,
            },
          }}
          { ...fieldProps }
        />
      ) }
      onChange={ (_event, newValue) => setValue(newValue) }
      onInputChange={ (_event, newInputValue) => setInputValue(newInputValue) }
      { ...autocompleteProp }
    />
  );
};
