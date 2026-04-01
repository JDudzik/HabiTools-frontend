import React, { useMemo, useState, useEffect } from 'react';
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
} from '@mui/material';
import { useApiSearchUsers } from 'lib/api/methods/adminControlsApi';


export const UserEmailSearchField = (props) => {
  const {
    selectedUser,
    onSelectUser,
    onInputValueChange,
    label = 'Search User by Email',
    placeholder = 'Type an email address',
  } = props;

  const [ inputValue, setInputValue ] = useState('');
  const [ debouncedInputValue, setDebouncedInputValue ] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [ inputValue ]);

  const normalizedInput = debouncedInputValue?.trim();
  const canSearch = normalizedInput?.length >= 2;

  const { data: searchedUsers, isLoading, isFetching, isError } = useApiSearchUsers({
    email: canSearch ? normalizedInput : '__email_search_disabled__',
    minimal_results: true,
  });

  const options = useMemo(() => {
    if (!canSearch || !Array.isArray(searchedUsers)) {
      return [];
    }
    return searchedUsers;
  }, [ canSearch, searchedUsers ]);

  const noOptionsText = useMemo(() => {
    if (!canSearch) {
      return 'Type at least 2 characters';
    }
    if (isError) {
      return 'Failed to load users';
    }
    return 'No users found';
  }, [ canSearch, isError ]);

  return (
    <Autocomplete
      size="small"
      value={ selectedUser || null }
      inputValue={ inputValue }
      options={ options }
      loading={ canSearch && (isLoading || isFetching) }
      noOptionsText={ noOptionsText }
      isOptionEqualToValue={ (option, value) => option?.id === value?.id }
      getOptionLabel={ option => option?.email || '' }
      filterOptions={ x => x }
      renderOption={ (optionProps, option) => (
        <Box component="li" { ...optionProps } key={ optionProps?.key }>
          <Box>
            <Box>{ option?.email || 'No email' }</Box>
            <Box sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
              {[ option?.first_name, option?.last_name ].filter(Boolean).join(' ') || 'No name'}
            </Box>
          </Box>
        </Box>
      ) }
      renderInput={ params => (
        <TextField
          { ...params }
          label={ label }
          placeholder={ placeholder }
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                { canSearch && (isLoading || isFetching) ? <CircularProgress color="inherit" size={ 16 } /> : null }
                { params.InputProps.endAdornment }
              </>
            ),
          }}
        />
      ) }
      onInputChange={ (_event, nextInputValue) => {
        setInputValue(nextInputValue || '');
        onInputValueChange?.(nextInputValue || '');
      } }
      onChange={ (_event, nextValue) => {
        onSelectUser?.(nextValue || null);
      } }
    />
  );
};