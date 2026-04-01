import * as Yup from 'yup';
import { 
  useFormik,
  Form,
  TextField,
  FormButton,
  PasswordField,
  HCaptchaField,
} from 'components/formik-mui';
import { Stack } from '@mui/material';


const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .required('Required'),
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  hcaptchaToken: Yup.string()
    .required('You must complete the captcha'),
});

export const FormFields = (props) => {
  const formik = useFormik({
    initialValues: { ...props.formFieldValues },
    validationSchema,
    onSubmit: (values) => {
      props.submitForm({
        ...values,
      });
    },
  });

  return (
    <Form formik={ formik }>
      <TextField 
        formik={ formik }
        type="text"
        name="email"
        label="Email"
      />

      <PasswordField formik={ formik } name="password" label="Password" />

      <TextField 
        formik={ formik }
        type="text"
        name="firstName"
        label="First Name"
      />
      <TextField
        formik={ formik }
        type="text"
        name="lastName"
        label="Last Name"
      />

      <HCaptchaField
        formik={ formik }
        name="hcaptchaToken"
        sitekey={ process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY_SIGNUP }
      />

      <Stack direction="row" justifyContent="space-between" mt={ 2 }>
        <FormButton
          formik={ formik }
          type="submit"
          variant="contained"
          color="primary"
        >
          Sign-Up
        </FormButton>{' '}
        <FormButton
          formik={ formik }
          isSubmit={ false }
          variant="outlined"
          color="secondary"
          onClick={ formik.handleReset }
        >
          Reset
        </FormButton>
      </Stack>
    </Form>
  );
};
