import React from 'react';
import {
  Stack,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { L } from 'components';
import * as Yup from 'yup';
import {
  useFormik,
  Form,
  FormButton,
  PasswordField,
} from 'components/formik-mui';
import { useMutateUpdatePassword } from 'lib/api/methods/userApi';


const initialValues = {
  oldPassword: '',
  newPassword: '',
};
const validationSchema = Yup.object({
  oldPassword: Yup.string()
    .required('Required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .required('Required'),
});


export const ChangePassword = (props) => {
  const { setInternalPageSlug, handleApiError } = props;
  const { mutate: mutateUpdatePassword } = useMutateUpdatePassword();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      mutateUpdatePassword({
        old_password: values?.oldPassword,
        new_password: values?.newPassword,
      }, {
        onSuccess: () => {
          setInternalPageSlug('success');
        },
        onError: (error) => {
          handleApiError({ error });
        },
        onSettled: () => setSubmitting(false),
      });
    },
  });
    
  return (
    <>
      <Stack spacing={ 2 } mb={ 4 } direction={{ xss: 'column', xs: 'row' }} alignItems="center">
        <Button
          variant="outlined"
          color="primary"
          startIcon={ <ArrowBackIcon /> }
          onClick={ () => setInternalPageSlug('main') }
        >Back to My Account</Button>
      </Stack>

      <L.h2 color="primary" mb={ 2 }>Change Password</L.h2>
      
      <Form formik={ formik }>
        <PasswordField
          hideIndicator
          formik={ formik }
          name="oldPassword"
          label="Current Password"
          autoComplete="current-password"
        />

        <PasswordField
          formik={ formik }
          name="newPassword"
          label="New Password"
          autoComplete="new-password"
        />

        <FormButton
          formik={ formik }
        >
          Change Password
        </FormButton>
      </Form>
    </>
  );
};