import { useMemo, useCallback, useEffect } from 'react';
import { NavigationProvider } from 'lib/contexts/NavigationContext';
import { ConfirmationModalProvider } from 'lib/contexts/ConfirmationModalContext';
import { UserProvider } from 'lib/contexts/UserContext';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useMutateSubmitAnalytic } from 'lib/api/methods/analyticApi';
import { useRouter } from 'next/router';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';


export const GlobalProviders = (props) => {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY && process.env.NEXT_PUBLIC_POSTHOG_URL) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_URL,
        session_recording: {
          maskAllInputs: true,
          maskTextSelector: '.sensitive',
        },
        loaded: (posthog) => {
          // debug mode in development
          if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_POSTHOG_DEBUG === 'true') {
            posthog.debug();
          }
        },
      });
    }
  }, []);

  // Track page views for PostHog
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      const handleRouteChange = () => posthog.capture('$pageview');
      router.events.on('routeChangeComplete', handleRouteChange);
  
      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
      };
    }
  }, [ router.events ]);


  // We're defining this queryClient inside the component so we can utilize the useMutateSubmitError
  // hook as the global error handler.
  // To be clear on this logic, there's two layers of queryClients. The top-most is just for global error submits.
  // This queryClient is used for everything else, but this one's call of "mutateSubmitAnalytic" targets the higher level queryClient.
  const { mutate: mutateSubmitAnalytic } = useMutateSubmitAnalytic();
  const onError = useCallback((error) => {
    if (error?.errorPayload && mutateSubmitAnalytic) {
      mutateSubmitAnalytic({
        source: 'frontend_error_logger',
        action_name: error?.errorPayload?.source,
        action_value: error?.errorPayload?.message || 'No message provided',
      });
    }
  }, [ mutateSubmitAnalytic ]);
  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
        onError,
      },
      mutations: {
        onError,
      },
    },
  }), [ onError ]);

  return (
    <>
      <PostHogProvider client={ posthog }>
        <QueryClientProvider client={ queryClient }>
          <UserProvider>
            <NavigationProvider>
              <ConfirmationModalProvider>

                {props.children}

              </ConfirmationModalProvider>
            </NavigationProvider>
          </UserProvider>
        </QueryClientProvider>
      </PostHogProvider>
    </>
  );
};
