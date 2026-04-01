import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';



export const DropdownField = (props) => {
  const {
    formik,
    id,
    name,
    label,
    options,
    hideEmptyOption,
    ...remainingProps
  } = props;
  const { palette } = useTheme();

  const renderedName = id || name;

  const thisValue = formik.values[renderedName];
  const thisError = formik.touched[renderedName] && Boolean(formik.errors[renderedName]);
  const thisHelperText = formik.touched[renderedName] && formik.errors[renderedName];

  return (
    <FormControl variant={ remainingProps?.variant || 'outlined' }>
      <InputLabel htmlFor={ renderedName } error={ thisError }>{label}</InputLabel>
      
      <Select
        native
        label={ label }
        id={ renderedName }
        name={ renderedName }
        value={ thisValue }
        error={ thisError }
        sx={{
          width: '100%',
        }}
        onChange={ formik.handleChange }
        { ...remainingProps }
      >
        {!hideEmptyOption && (
          <option value="" />
        )}
        {typeof options === 'object' && Object.keys(options).map(key => (
          <option key={ key } value={ key }>{options[key]}</option>
        ))}
      </Select>

      {thisError && (
        <FormHelperText style={{ color: palette.error.main }}>{thisHelperText}</FormHelperText>
      )}
    </FormControl>
  );
};
