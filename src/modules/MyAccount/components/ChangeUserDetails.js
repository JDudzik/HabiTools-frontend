import { useEffect } from 'react';
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
  TextField,
} from 'components/formik-mui';
import { useMutateUpdateMyUser } from 'lib/api/methods/userApi';


const initialValues = {
  first_name: '',
  last_name:  '',
};
const validationSchema = Yup.object({
  first_name: Yup.string().required('Required').max('255', 'First name must be less than 255 characters'),
  last_name: Yup.string().required('Required').max('255', 'Last name must be less than 255 characters'),
});


export const ChangeUserDetails = (props) => {
  const { setInternalPageSlug, handleApiError, userState } = props;
  const { mutate: mutateUpdateUser } = useMutateUpdateMyUser();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      mutateUpdateUser({
        first_name: values?.first_name,
        last_name: values?.last_name,
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

  useEffect(() => {
    formik.setFieldValue('first_name', userState?.user?.first_name || '', false);
    formik.setFieldValue('last_name', userState?.user?.last_name || '', false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ userState?.user ]);

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

      <L.h2 color="primary" mb={ 2 }>Change Account Details</L.h2>
      
      <Form formik={ formik }>
        <TextField 
          formik={ formik }
          type="text"
          name="first_name"
          label="First Name"
        />

        <TextField 
          formik={ formik }
          type="text"
          name="last_name"
          label="Last Name"
        />

        <FormButton
          formik={ formik }
        >
          Update Details
        </FormButton>
      </Form>
    </>
  );
};