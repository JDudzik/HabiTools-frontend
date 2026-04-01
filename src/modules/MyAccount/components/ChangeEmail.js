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
  TextField,
} from 'components/formik-mui';
import { useMutateUpdateEmail, useMutateResendVerifyEmail } from 'lib/api/methods/userApi';


const initialValues = {
  new_email: '',
  password: '',
};

export const ChangeEmail = (props) => {
  const { activateRouting, setInternalPageSlug, handleApiError, setPageStage, openConfirmation, userDispatch, userState } = props;
  const { mutate: mutateUpdateEmail } = useMutateUpdateEmail();
  const { mutate: mutateResendVerifyEmail } = useMutateResendVerifyEmail();

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      new_email: Yup.string()
        .required('Required')
        .email('Must be a valid email address')
        .test('match-email', 'Must not match your current email address', value => value !== userState?.user?.email),
      password: Yup.string()
        .required('Required'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      mutateUpdateEmail({
        new_email: values?.new_email,
        password: values?.password,
      }, {
        onSuccess: () => {
          setPageStage('loading');
          userDispatch({ type: 'LOGOUT' });
          mutateResendVerifyEmail({ email: values?.new_email });
          openConfirmation({
            title: 'Email Updated',
            content: (
              <L.p>Your email has been successfully updated and you will need to sign back in.
                <br /><br /><L.div>Additionally, a verification email has been sent to your new email address for confirmation.</L.div>
              </L.p>
            ),
            primaryButtonText: 'Okay',
            removeSecondaryAction: true,
          });
          setTimeout(() => {
            activateRouting('/login?logout=true');
          }, 500);
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
      <Stack spacing={ 2 } mt={ 2 } mb={ 4 } direction={{ xss: 'column', xs: 'row' }} alignItems="center">
        <Button
          variant="outlined"
          color="primary"
          startIcon={ <ArrowBackIcon /> }
          onClick={ () => setInternalPageSlug('main') }
        >Back to My Account</Button>
      </Stack>

      <L.h2 color="primary" mb={ 2 }>Change Email</L.h2>
      <Stack px={{ xxs: 0, xs: 2 }} mb={ 4 } spacing={ 2 } maxWidth="500px" textAlign="left">
        <L.p>
          This will change the email address that you sign in with and that is associated with your account.
          Updating your email address will require you to sign in again with the new email.
          <L.div mt={ 1 }>You must also confirm your password to proceed.</L.div>
        </L.p>

        <Form formik={ formik } pt={ 2 } mb={ 2 }>
          <TextField 
            formik={ formik }
            type="text"
            name="new_email"
            label="New Email"
          />
          <PasswordField hideIndicator formik={ formik } name="password" label="Password" />

          <FormButton
            formik={ formik }
            color="primary"
          >
            Update Email
          </FormButton>
        </Form>
      </Stack>
    </>
  );
};