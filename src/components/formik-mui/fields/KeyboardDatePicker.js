import React, { useMemo, useCallback } from 'react';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';


export const KeyboardDatePicker = (props) => {
  const {
    formik,
    id,
    name,
    label,
    sx,
    ...remainingProps
  } = props;
  const renderedName = id || name;

  const thisValue = useMemo(() => {
    const value = formik.values[renderedName];
    if (value === null || value === undefined) {
      return null;
    }
    if (dayjs.isDayjs(value)) {
      return value;
    }
    return dayjs(value);
  }, [ formik.values, renderedName ]);


  const hasAttemptedSubmit = formik.submitCount > 0;

  const thisHelperText = hasAttemptedSubmit && formik.errors[renderedName];
  const setThisValue = useCallback(
    value => formik.setFieldValue(renderedName, value),
    [ formik, renderedName ],
  );

  const handleChange = useMemo(() => (date => setThisValue(date)), [ setThisValue ]);

  return (
    <LocalizationProvider dateAdapter={ AdapterDayjs }>
      <DatePicker
        { ...remainingProps }
        sx={{ width: '100%', ...sx }}
        label={ label }
        value={ thisValue }
        slotProps={{
          textField: {
            helperText: thisHelperText,
            error: !!thisHelperText,
          },
        }}
        onChange={ handleChange }
      />
    </LocalizationProvider>
  );
};