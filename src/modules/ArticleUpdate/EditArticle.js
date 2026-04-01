import {
  Button,
} from '@mui/material';
import {
  useFormik,
  Form,
  TextField,
  FormButton,
} from 'components/formik-mui';
import { useMutateUpdateArticle } from 'lib/api/methods/articleApi';
import * as Yup from 'yup';


const validationSchema = Yup.object({
  content: Yup.object({
    content: Yup.string(),
  }),
  title: Yup.string().required('Required'),
});


export const EditArticle = ({ 
  articleDetails, 
  handleBackToSelection,
  setPageError,
  handleApiError,
}) => {
  const { mutate: mutateUpdateArticle } = useMutateUpdateArticle();
  
  const handleSubmit = (values) => {
    setPageError();
    const payload = {
      id: values.id,
      title: values.title,
      content: values.content.content,
      tags: values.tags,
    };

    mutateUpdateArticle(payload, {
      onSuccess: () => handleBackToSelection('success'),
      onError: error => handleApiError({ error }),
    });
  };

  const formik = useFormik({
    initialValues: articleDetails,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={ () => handleBackToSelection() }
      >Back to Article Selection</Button>
      <br /> <br />

      <Form formik={ formik }>
        <TextField
          formik={ formik }
          type="text"
          name="title"
          label="Title"
        />

        <TextField 
          multiline
          formik={ formik }
          type="text"
          name="content.content"
          label="Content"
        />

        <div>
          <FormButton
            formik={ formik }
            type="submit"
            variant="contained"
            color="primary"
          >
            Save
          </FormButton>
        </div>
      </Form>
    </>
  );
};
