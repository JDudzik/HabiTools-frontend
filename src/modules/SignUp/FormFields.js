import * as Yup from 'yup';
import { 
  useFormik,
  Form,
  TextField,
  FormButton,
  DropdownField,
  KeyboardDatePicker,
  PasswordField,
  HCaptchaField,
} from 'components/formik-mui';
import { Stack } from '@mui/material';
import dayjs from 'dayjs';


const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .required('Required'),
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  dob: Yup.date('Must be a proper date')
    .typeError('Date Of Birth must be in the format: MM/DD/YYYY')
    .nullable()
    .max(dayjs(), 'Date of Birth cannot be after today')
    .min(dayjs('1900-01-01'), 'Date of Birth must be after 1900-01-01'),
  gender: Yup.string()
    .matches(/(male|female|unspecified)/, 'You must select a correct value')
    .required('Required'),
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
        dob: values?.dob?.valueOf() || null,
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

      <KeyboardDatePicker 
        formik={ formik }
        name="dob"
        label="Date of Birth"
        maxDate={ dayjs() }
        minDate={ dayjs('1900-01-01') }
      />

      <DropdownField
        formik={ formik }
        name="gender"
        label="Gender"
        hideEmptyOption={ false }
        options={{
          male: 'Male',
          female: 'Female',
          unspecified: 'I\'d prefer to not say',
        }}
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
