import React, { useEffect } from 'react';
import * as Yup from 'yup';
import {
  useFormik,
  Form,
  TextField,
  FormButton,
} from 'components/formik-mui';
import { useRouter } from 'next/router';


const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Required'),
});

export const ResendForm = ({ onSubmit }) => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit,
  });
  
  /* When this page mounts */
  useEffect(() => {
    const queryEmail = router.query.email;
    if (queryEmail) {
      formik?.setFieldValue('email', router.query.email);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ router.query.email ]);

  return (
    <Form formik={ formik }>
      <TextField 
        formik={ formik }
        type="text"
        name="email"
        label="Email"
      />

      <FormButton
        formik={ formik }
        allowCleanSubmit={ true }
      >
        Send Verification Email
      </FormButton>
    </Form>
  );  
};
