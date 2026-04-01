import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PageHead, L } from 'components';
import { usePageManager } from 'lib/hooks';
import { useAxiosCreateCheckoutSession } from 'lib/api/methods/commerceApi';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const router = useRouter();
  const { price_id } = router.query;
  const [ checkoutSessionError, setCheckoutSessionError ] = useState();
  const { createCheckoutSession } = useAxiosCreateCheckoutSession();
  
  const handleCreateCheckoutSession = useCallback(() => {
    return createCheckoutSession({
      price_id,
    })
      .catch((err) => {
        if (err?.response?.data?.status) {
          setCheckoutSessionError(err?.response?.data);
        } else {
          throw err;
        }
      });
  }, [ createCheckoutSession, price_id ]);

  const {
    activateRouting,
    pageStage,
  } = usePageManager({
    defaultHandleApiError: {
      returnPath: `/checkout?price_id=${ price_id }`,
      handledErrors: [],
    },
    apiIsLoading: (!router.isReady),
    apiErrors: checkoutSessionError,
  });

  useEffect(() => {
    if (router.isReady && !price_id) {
      activateRouting('/pricing', 'replace');
    }
  }, [ price_id, router.isReady, activateRouting ]);

  return (
    <L.div paddingX={ 2 } paddingBottom={ 2 } minWidth="100%">
      <PageHead title="Checkout" />
      <L.h1 marginTop={ 1 } color="primary" textAlign="center">
        Checkout
      </L.h1>
      <br />
      
      {pageStage === 'main' && (
        <div id="checkout">
          <EmbeddedCheckoutProvider
            stripe={ stripePromise }
            options={{ fetchClientSecret: handleCreateCheckoutSession }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      )}
    </L.div>
  );
};

export default Checkout;