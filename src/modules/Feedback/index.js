import {
  Button,
  Stack,
} from '@mui/material';
import { LoadingElement, Link, PageHead, L } from 'components';
import { usePageManager } from 'lib/hooks';
import { FeedbackForm } from './FeedbackForm';
import { useMutateSubmitFeedback } from 'lib/api/methods/feedbackApi';


const FeedbackPage = () => {
  const {
    pageStage,
    setPageStage,
    handleApiError,
  } = usePageManager({
    defaultHandleApiError: {
      returnPath: '/feedback',
      handledErrors: [],
    },
    defaultPageStage: 'main',
  });

  const { mutate: mutateSubmitFeedback } = useMutateSubmitFeedback();
  
  const handleSubmit = (values) => {
    mutateSubmitFeedback(values, {
      onSuccess: () => setPageStage('success'),
      onError: error => handleApiError({ error }),
    });
  };


  return (
    <>
      <PageHead title="Feedback" />

      <Stack width="100%" maxWidth="20em" alignItems="center">
        <br />
        <L.h1 color="primary" textAlign="center">
          Feedback
        </L.h1>
        <br />


        {pageStage === 'loading' && (
          <LoadingElement article width="100%" />
        )} 


        {pageStage === 'success' && (
          <Stack alignItems="center" >
            <L.h2 textAlign="center">
              Thank you for your feedback!
            </L.h2>
            <br />
            <L.p textAlign="center">
              We have received your message. If a response is needed, we will send it to the email address that you have provided.
            </L.p>
            <br />

            <Button
              component={ Link }
              href="/"
              variant="contained"
              color="primary"
            >Back to Home</Button>
            <br /><br />
          </Stack>
        )}


        {pageStage === 'main' && (
          <div>
            <L.p textAlign="center">
              We value your feedback! Please let us know your thoughts, suggestions, or any issues you have encountered.
            </L.p>
            <br /><br />

            <FeedbackForm 
              onSubmit={ handleSubmit }
            />
          </div>
        )}

      </Stack>
    </>
  );
};


export default FeedbackPage;
