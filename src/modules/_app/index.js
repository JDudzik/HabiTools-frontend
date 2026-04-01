import React, { useEffect, useContext } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  ThemeSetter,
  NavBar,
  GlobalProviders,
  TopErrorReport,
  LayoutErrorBoundary,
  GlobalConfirmationModal,
} from './components';
import { defaultNavItems, appConfig } from 'lib/data';
import { navigationContext } from 'lib/contexts/NavigationContext';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useMutateSubmitError } from 'lib/api/methods/errorApi';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { getCredentialHeaders } from 'lib/hooks/helpers/getCredentialHeaders';


const errorQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const RenderApp = (props) => {
  const { children } = props;
  const { navigationDispatch } = useContext(navigationContext);
  const router = useRouter();
  const credentialHeaders = getCredentialHeaders();

  // When the app initially mounts
  useEffect(() => {
    /* Prefetch the general error page so that it's available even offline */
    router.prefetch('/something-went-wrong');

    /* Set the default options navigation options */
    navigationDispatch({ type: 'MODIFY_PRIMARY_LINKS', payload: () => defaultNavItems.primary });
    navigationDispatch({ type: 'MODIFY_CONTEXT_LINKS', payload: () => defaultNavItems.context });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If the user is logged in and hits the landing page, redirect them to the initial page of the app to skip unecessary navigation.
  useEffect(() => {
    const isLoggedIn = !!(credentialHeaders['x-key'] && credentialHeaders['x-access-token']);
    if (router.pathname === '/') {
      if (isLoggedIn) {
        router.replace(appConfig?.authorizedUserHome || '/my-account');
      }
    }
  }, [ credentialHeaders, router, router.pathname ]);



  return children;
};

const InnerApp = (props) => {
  const { Component, pageProps } = props;
  const { mutate: mutateSubmitError } = useMutateSubmitError();  

  return (
    <TopErrorReport mutateSubmitError={ mutateSubmitError }>
      <GlobalProviders errorQueryClient={ errorQueryClient }>
        <ThemeSetter>
          <RenderApp>
            <Head>
              <meta charSet="UTF-8" />
              <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
              <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
              <meta name="description" content="NEW REPO DESCRIPTION" />
              <meta name="keywords" content="NEW REPO KEYWORDS" />
              <title>NEW REPO</title>
                
              <link rel="manifest" href="/manifest.json" />
              <link href="/favicon-16x16.png" rel="icon" type="image/png" sizes="16x16" />
              <link href="/favicon-32x32.png" rel="icon" type="image/png" sizes="32x32" />
              <link href="/apple-icon.png" rel="apple-touch-icon" />
              <link rel="icon" href="/favicon.ico" />
              <meta name="theme-color" content="#317EFB" />

              <meta property="og:title" content="NEW REPO" />
              <meta property="og:type" content="website" />
              <meta property="og:description" content="NEW REPO DESCRIPTION" />
              <meta property="og:image" content="BASE_URL/images/icons/icon-512x512.png" />
              <meta property="og:url" content="BASE_URL/" />
              <meta name="twitter:card" content="summary_large_image" />
            </Head>

            <NavBar />

            <LayoutErrorBoundary mutateSubmitError={ mutateSubmitError }>
              <main>
                <Component { ...pageProps } />
              </main>
              <GlobalConfirmationModal />
            </LayoutErrorBoundary>

          </RenderApp>
          <ReactQueryDevtools initialIsOpen={ false } buttonPosition="bottom-left" />
        </ThemeSetter>
      </GlobalProviders>
    </TopErrorReport>
  );
};

const _app = (props) => {
  return (
    <QueryClientProvider client={ errorQueryClient }>
      <InnerApp { ...props } />
    </QueryClientProvider>
  );
};

export default _app;