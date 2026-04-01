import React from 'react';

// Visuals (Components, Modules)
import { LoadingElement, PageHead, L } from 'components';
import { VerificationError, VerifyEmail, ResetPassword } from './components';

// Logic (Utils, Contexts, APIs)
import { useRouter } from 'next/router';
import { useApiVerifyEmailConfirmation } from 'lib/api/methods/emailConfirmationApi';
import { usePageManager } from 'lib/hooks';


const confirmationMap = {
  'verify-email': VerifyEmail,
  'reset-password': ResetPassword,
};

const EmailConfirmations = () => {
  const router = useRouter();
  const { type, token } = router.query;

  const PickedConfirmation = confirmationMap[type];
  
  const { isLoading, error } = useApiVerifyEmailConfirmation({ type, token });

  const {
    pageStage,
    pageError,
    handleApiError,
  } = usePageManager({
    defaultHandleApiError: {
      returnPath: `/email-confirmations/?type=${ type }&token=${ token }`,
      handledErrors: [ 'NO_STATUS', 'UNKNOWN_ERROR', 'FAILED_TO_FETCH', 'CONFIRMATION_INVALID', 'CONFIRMATION_ALREADY_COMPLETED', 'CONFIRMATION_EXPIRED' ],
    },
    defaultPageStage: 'loading',
    apiIsLoading: !router.isReady || isLoading || !PickedConfirmation,
    apiErrors: error,
  });

  return (
    <L.div paddingX={ 2 }>
      <PageHead title="Confirmation" />

      {pageStage === 'loading' && <LoadingElement article width="100%" />}
      {pageStage === 'error' && <VerificationError pageError={ pageError } />}
      {pageStage === 'main' && (
        <PickedConfirmation
          type={ type }
          token={ token }
          handleApiError={ handleApiError }
        />
      ) }
    </L.div>
  );
};

export default EmailConfirmations;