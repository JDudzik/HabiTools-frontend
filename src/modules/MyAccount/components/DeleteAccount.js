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
import { useMutateDeleteMyUser } from 'lib/api/methods/userApi';


const initialValues = {
  email: '',
  password: '',
};

export const DeleteAccount = (props) => {
  const { activateRouting, setInternalPageSlug, handleApiError, userState, setPageStage, openConfirmation, userDispatch } = props;
  const { mutate: mutateDeleteMyUser } = useMutateDeleteMyUser();

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      email: Yup.string()
        .required('Required')
        .test('match-email', 'Must match your current email address', value => value?.toLowerCase() === userState?.user?.email?.toLowerCase()),
      password: Yup.string()
        .required('Required'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      openConfirmation({
        color: 'error',
        title: <L.b>Confirm Deletion</L.b>,
        content: <L.p><L.b color="error.main">This action cannot be undone.</L.b> Are you sure you want to delete your account?</L.p>,
        primaryButtonText: 'Delete Account',
        secondaryButtonText: 'Cancel',
        onRequestClose: () => setSubmitting(false),
        onRequestSubmit: () => {
          mutateDeleteMyUser({
            password: values?.password,
          }, {
            onSuccess: () => {
              setPageStage('loading');
              userDispatch({ type: 'LOGOUT' });
              openConfirmation({
                title: <L.b>Account Deleted</L.b>,
                content: <L.p>Your account has successfully been deleted and you've been signed out.</L.p>,
                primaryButtonText: 'Okay',
                removeSecondaryAction: true,
              });
              setTimeout(() => {
                activateRouting('/');
              }, 500);
            },
            onError: (error) => {
              handleApiError({ error });
            },
            onSettled: () => setSubmitting(false),
          });
        },
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

      <L.h2 color="warning" mb={ 2 }>Delete Account</L.h2>
      <Stack px={{ xxs: 0, xs: 2 }} mb={ 4 } spacing={ 2 } maxWidth="500px" textAlign="left">
        <L.p color="warning.dark">
          <b>This is irreversible.</b> You will lose access and your data will be permanently deleted.
          You will need to create a new account to regain access, but none of your previous data or purchases can be restored.
        </L.p>
        <L.p color="warning.dark">
          If you are sure you want to proceed with deleting your account,
          confirm your email address, <b>{ userState?.user?.email }</b>, and
          enter your password to complete the deletion process.
        </L.p>

        <Form formik={ formik } pt={ 2 } mb={ 2 }>
          <TextField 
            formik={ formik }
            type="text"
            name="email"
            label="Email"
          />

          <PasswordField hideIndicator formik={ formik } name="password" label="Password" />

          <FormButton
            formik={ formik }
            color="error"
          >
            Delete My Account
          </FormButton>
        </Form>
      </Stack>
    </>
  );
};