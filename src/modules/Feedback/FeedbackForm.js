import React, { useEffect, useContext } from 'react';
import * as Yup from 'yup';
import { useFormik, Form, TextField, FormButton, DropdownField } from 'components/formik-mui';
import { userContext } from 'lib/contexts/UserContext';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';


const initialValues = {
  email: '',
  source: '',
  topic: '',
  message: '',
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Required'),
  topic: Yup.string()
    .matches(/(bug_report|suggestion|help|other)/, 'You must select a correct topic')
    .required('Required'),
  message: Yup.string().required('Required'),
});

export const FeedbackForm = ({ onSubmit }) => {
  const { userState } = useContext(userContext);
  const router = useRouter();
  const { source, topic } = router.query;

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    formik.setFieldValue('email', userState?.user?.email || '', false);
    formik.setFieldValue('source', source || '', false);
    formik.setFieldValue('topic', topic || '', false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ source, topic ]);

  return (
    <Form formik={ formik }>
      <TextField 
        formik={ formik }
        type="text"
        name="email"
        label="Email"
      />

      <DropdownField
        formik={ formik }
        name="topic"
        label="Topic"
        options={{
          bug_report: 'Bug Report',
          suggestion: 'Suggestion',
          help: 'Help',
          other: 'Other',
        }}
      />

      <TextField 
        multiline
        minRows={ 6 }
        formik={ formik }
        name="message"
        label="Message"
      />

      <Stack direction="row" justifyContent="center" mt={ 2 } mb={ 2 }>
        <FormButton
          formik={ formik }
        >
          Send
        </FormButton>
      </Stack>
    </Form>
  );  

};
