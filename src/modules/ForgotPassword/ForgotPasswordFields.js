import React from 'react';
import * as Yup from 'yup';
import {
  useFormik,
  Form,
  TextField,
  FormButton,
  HCaptchaField,
} from 'components/formik-mui';

const initialValues = {
  email: '',
};
const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Required'),
  hcaptchaToken: Yup.string()
    .required('You must complete the captcha'),
});


export const ForgotPasswordFields = ({ onSubmit }) => {
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
      />

      <HCaptchaField
        formik={ formik }
        name="hcaptchaToken"
        sitekey={ process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY_PASSWORD_RESET }
      />

      <p>This will send a password reset link to your email address</p>
      <FormButton
        formik={ formik }
      >
        Send Password Reset
      </FormButton>
    </Form>
  );  

};
