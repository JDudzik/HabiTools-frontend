import { useState } from 'react';

import {
  IconButton,
  InputAdornment,
  TextField as MuiTextField,
} from '@mui/material';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import { PasswordIndicator } from './PasswordIndicator';


export const PasswordField = (props) => {
  const {
    formik,
    id,
    name,
    label,
    hideIndicator,
    hideToggleVisible,
    ...remainingProps
  } = props;
  const [ showPass, setShowPass ] = useState(false);
  
  const renderedName = id || name;
  const thisValue = formik.values[ renderedName ];
  const thisError = formik.touched[ renderedName ] && Boolean(formik.errors[ renderedName ]);
  const thisHelperText = formik.touched[ renderedName ] && formik.errors[ renderedName ];


  return (
    <div>
      <MuiTextField
        id={ renderedName }
        name={ renderedName }
        label={ label }
        value={ thisValue }
        error={ thisError }
        helperText={ thisHelperText }
        type={ showPass ? 'text' : 'password' }
        sx={{
          width: '100%',
        }}
        InputProps={{
          endAdornment: (!hideToggleVisible && (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={ () => setShowPass(!showPass) }
                onMouseDown={ event => event.preventDefault() }
              >
                { showPass ? <Visibility /> : <VisibilityOff /> }
              </IconButton>
            </InputAdornment>
          )),
        }}
        onChange={ formik.handleChange }
        { ...remainingProps }
      />

      { !hideIndicator && !thisHelperText && <PasswordIndicator hideTooShort password={ thisValue } /> }
    </div>
  );
};
