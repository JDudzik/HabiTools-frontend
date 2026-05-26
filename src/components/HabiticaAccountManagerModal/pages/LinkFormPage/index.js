import React, { useState } from 'react';
import {
  Stack,
  Button,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import * as Yup from 'yup';
import { L, MarkdownMui } from 'components';
import {
  useFormik,
  Form,
  FormButton,
  TextField,
} from 'components/formik-mui';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useMutateLinkHabitica } from 'lib/api/methods/habiticaApi';
import appCredentialInstructions from './appCredentialInstructions.md';
import desktopCredentialInstructions from './desktopCredentialInstructions.md';


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
  const [ expandedAccordion, setExpandedAccordion ] = useState(false);

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

      <L.p>To link your Habitica account, you'll need your <b>Habitica User ID</b> and <b>API Token</b>.</L.p>
      <L.p>Select the instructions based on how you use Habitica:</L.p>

      <Stack direction="column" spacing={ 3 } pb={ 2 }>
        <Accordion
          disableGutters
          expanded={ expandedAccordion === 'app' }
          onChange={ (e, isExpanded) => setExpandedAccordion(isExpanded ? 'app' : false) }
        >
          <AccordionSummary
            expandIcon={ <ExpandMoreIcon /> }
            aria-controls="app-instructions"
            id="app-instructions-header"
          >
            <L.h3>Mobile App Instructions</L.h3>
          </AccordionSummary>
          <AccordionDetails>
            <MarkdownMui.Markdown>
              { appCredentialInstructions }
            </MarkdownMui.Markdown>
          </AccordionDetails>
        </Accordion>

        <Accordion
          disableGutters
          expanded={ expandedAccordion === 'desktop' }
          onChange={ (e, isExpanded) => setExpandedAccordion(isExpanded ? 'desktop' : false) }
        >
          <AccordionSummary
            expandIcon={ <ExpandMoreIcon /> }
            aria-controls="desktop-instructions"
            id="desktop-instructions-header"
          >
            <L.h3>Desktop Instructions</L.h3>
          </AccordionSummary>
          <AccordionDetails>
            <MarkdownMui.Markdown>
              { desktopCredentialInstructions }
            </MarkdownMui.Markdown>
          </AccordionDetails>
        </Accordion>
      </Stack>

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
