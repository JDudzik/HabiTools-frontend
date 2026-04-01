import React from 'react';
import * as Yup from 'yup';
import {
  useFormik,
  Form,
  FormButton,
  PasswordField,
} from 'components/formik-mui';

const initialValues = {
  passwordOne: '',
  passwordTwo: '',
};


const validationSchema = Yup.object({
  passwordOne: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .required('Required'),
  passwordTwo: Yup.string()
    .required('Required')
    .test(
      'passwords-match',
      'The passwords must match exactly',
      // eslint-disable-next-line no-invalid-this
      function validateEquality(value) { return value === this.parent.passwordOne; },
    ),
});

export const ResetPasswordFields = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <Form formik={ formik }>
      <PasswordField
        formik={ formik }
        name="passwordOne"
        label="New Password"
      />

      <PasswordField
        hideIndicator
        hideToggleVisible
        formik={ formik }
        name="passwordTwo"
        label="Re-type New Password"
      />

      <FormButton
        formik={ formik }
      >
        Save New Password
      </FormButton>
    </Form>
  );  
};