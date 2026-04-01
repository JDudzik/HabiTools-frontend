import React from 'react';
import * as Yup from 'yup';
import {
  useFormik,
  Form,
  TextField,
  FormButton,
  PasswordField,
} from 'components/formik-mui';
import { Link } from 'components/Link';


const initialValues = {
  email: '',
  password: '',
};
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Required'),
  password: Yup.string()
    .required('Required'),
});

export const LoginForm = ({ onSubmit }) => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <Form formik={ formik }>
      <TextField 
        formik={ formik }
        type="text"
        name="email"
        label="Email"
        autoComplete="email"
      />

      <PasswordField
        hideIndicator
        formik={ formik }
        name="password"
        label="Password"
        autoComplete="current-password"
      />

      <Link
        component="div"
        mt="1rem"
        href="/forgot-password"
        color="secondary"
      >
        Forgot Password
      </Link>

      <FormButton
        formik={ formik }
      >
        Login
      </FormButton>
    </Form>
  );  

};
