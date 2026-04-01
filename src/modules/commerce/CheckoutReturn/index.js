import React, { useEffect, useContext } from 'react';
import { Stack, Button } from '@mui/material';
import { LoadingElement, PageHead, Link, L } from 'components';
import { usePageManager } from 'lib/hooks';
import { useApiGetCheckoutSessionStatus } from 'lib/api/methods/commerceApi';
import { useRouter } from 'next/router';
import { userContext } from 'lib/contexts/UserContext';


const CheckoutReturn = () => {
  const router = useRouter();
  const { session_id: sessionId } = router.query;
  const { userState, userDispatch } = useContext(userContext);

  useEffect(() => {
    if (userState?.user?.id) {
      userDispatch({ type: 'REFRESH_USER' } );
    }
  }, [ userDispatch, userState?.user?.id ]);

  const {
    data: createCheckoutSessionData,
    isLoading: isLoadingCheckoutSession,
    error: errorCheckoutSession,
  } = useApiGetCheckoutSessionStatus({ sessionId });

  const {
    pageStage,
    setPageStage,
  } = usePageManager({
    defaultHandleApiError: {
      returnPath: '/checkout/return',
    },
    defaultPageStage: 'loading',
    apiIsLoading: !createCheckoutSessionData && isLoadingCheckoutSession,
    apiErrors: errorCheckoutSession,
  });

  useEffect(() => {
    if (createCheckoutSessionData?.status === 'open') {
      setPageStage('error');
    }
  }, [ createCheckoutSessionData?.status, setPageStage ]);


  return (
    <L.div paddingX={ 2 } minWidth="100%">
      <PageHead title="Checkout Return" />

      {/* /////////// */}
      {/* Page Stages */}
      {/* /////////// */}
      {pageStage === 'main' && (
        <Stack
          spacing={ 3 }
          direction="column"
          alignItems="center"
          textAlign="center"
          sx={{ paddingY: 4 }}
        >
          <L.h1 color="primary">
            Congratulations!
          </L.h1>
          <L.p>
            Thank you for your purchase. Your transaction was successful.
          </L.p>
          <L.p>
            You can now access your product or service.
          </L.p>
          <Stack sx={{ paddingTop: 2 }}>
            <Link href="/">
              <Button
                variant="contained" 
                size="large"
              >
                Back to Home
              </Button>
            </Link>
          </Stack>
        </Stack>
      )}


      {pageStage === 'loading' && (
        <LoadingElement article width="100%" />
      )}


      {pageStage === 'error' && (
        <Stack
          spacing={ 3 }
          direction="column"
          alignItems="center"
          textAlign="center"
          sx={{ paddingY: 4 }}
        >
          <L.h1 color="primary">
            Sorry!
          </L.h1>
          <L.p>
            Something went wrong with your purchase. Please try again.
          </L.p>
          <Stack sx={{ paddingTop: 2 }}>
            <Link href="/checkout">
              <Button
                variant="contained" 
                size="large"
              >
                Back to Checkout
              </Button>
            </Link>
          </Stack>
        </Stack>
      )}
    </L.div>
  );
};

export default CheckoutReturn;