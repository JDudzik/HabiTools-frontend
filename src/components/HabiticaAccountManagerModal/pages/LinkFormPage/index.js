import React from 'react';
import { Stack, Button, Alert } from '@mui/material';
import * as Yup from 'yup';
import { L, MarkdownMui } from 'components';
import {
  useFormik,
  Form,
  FormButton,
  TextField,
} from 'components/formik-mui';
import { useMutateLinkHabitica } from 'lib/api/methods/habiticaApi';
import credentialInstructions from './credentialInstructions.md';


const initialValues = {
  habiticaUserId: '',
  apiKey: '',
};

const ERROR_MESSAGE_MAP = {
  INVALID_CREDENTIALS: 'The Habitica User ID or API Key is invalid. Please check and try again.',
  ALREADY_LINKED: 'You already have a linked Habitica account. Unlink it before adding a new one.',
  HABITICA_UNREACHABLE: 'Could not reach Habitica. Please try again later.',
  MISSING_FIELDS: 'Both Habitica User ID and API Key are required.',
};

export const LinkFormPage = ({ onNavigate }) => {
  const { mutate: mutateLinkHabitica } = useMutateLinkHabitica();

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      habiticaUserId: Yup.string()
        .required('Required')
        .uuid('Must be a valid Habitica User ID'),
      apiKey: Yup.string()
        .required('Required')
        .uuid('Must be a valid API Token'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      mutateLinkHabitica({
        habiticaUserId: values.habiticaUserId,
        apiKey: values.apiKey,
      }, {
        onSuccess: () => {
          onNavigate('linkSuccess');
        },
        onError: (error) => {
          const status = error?.response?.data?.status;
          const errorMsg = ERROR_MESSAGE_MAP[status] || 'Failed to link Habitica account. Please try again.';
          formik.setStatus(errorMsg);
        },
        onSettled: () => setSubmitting(false),
      });
    },
  });

  return (
    <Stack spacing={ 3 }>
      <L.h3>Link Your Habitica Account</L.h3>

      <MarkdownMui.Markdown>
        { credentialInstructions }
      </MarkdownMui.Markdown>

      {formik.status && (
        <Alert severity="error">
          {formik.status}
        </Alert>
      )}

      <Form formik={ formik } spacing={ 2 }>
        <TextField
          formik={ formik }
          type="text"
          name="habiticaUserId"
          label="Habitica User ID"
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        />
        <TextField
          formik={ formik }
          type="text"
          name="apiKey"
          label="API Token"
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        />

        <FormButton
          formik={ formik }
          color="primary"
        >
          Link Account
        </FormButton>
      </Form>

      <Stack spacing={ 2 } direction="row" justifyContent="flex-start">
        <Button
          variant="outlined"
          disabled={ formik.isSubmitting }
          onClick={ () => onNavigate('unlinkedIntro') }
        >
          Back
        </Button>
      </Stack>
    </Stack>
  );
};
