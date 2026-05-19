import React from 'react';
import { Stack, Button, Link, Alert } from '@mui/material';
import * as Yup from 'yup';
import { L } from 'components';
import {
  useFormik,
  Form,
  FormButton,
  TextField,
} from 'components/formik-mui';
import { useMutateLinkHabitica } from 'lib/api/methods/habiticaApi';


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

export const LinkFormPage = ({ onNavigate, onLinkSuccess }) => {
  const { mutate: mutateLinkHabitica } = useMutateLinkHabitica();

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      habiticaUserId: Yup.string()
        .required('Required')
        .uuid('Must be a valid Habitica User ID'),
      apiKey: Yup.string()
        .required('Required')
        .min(20, 'API Key should be at least 20 characters'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      mutateLinkHabitica({
        habiticaUserId: values.habiticaUserId,
        apiKey: values.apiKey,
      }, {
        onSuccess: () => {
          onLinkSuccess();
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

      <L.div>
        <L.p>
          To link your Habitica account, you'll need your Habitica User ID and API Key.
        </L.p>
        <L.p sx={{ fontSize: '0.9rem' }}>
          <strong>Where to find them:</strong>
        </L.p>
        <ol>
          <li>
            Go to{' '}
            <Link
              href="https://habitica.com/user/settings/api"
              target="_blank"
              rel="noopener noreferrer"
            >
              your Habitica API settings
            </Link>
          </li>
          <li>Copy your User ID (shown in the API settings page)</li>
          <li>Generate or copy your API Token</li>
          <li>Paste them below</li>
        </ol>
      </L.div>

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
          placeholder="e.g., 12345678-1234-1234-1234-123456789012"
        />
        <TextField
          formik={ formik }
          type="text"
          name="apiKey"
          label="API Key"
          placeholder="e.g., 1234567890123456789012345678901234567890"
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
