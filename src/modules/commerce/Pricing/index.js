// import { useContext } from 'react';
import {
  PageHead,
  L,
  // AuthCtaButtons,
} from 'components';
// import { PricingTable } from './components';
import { usePageManager } from 'lib/hooks';
// import { appConfig } from 'lib/data';
// import { userContext } from 'lib/contexts/UserContext';
// import { Stack, Typography } from '@mui/material';


const Pricing = () => {
  // const { userState } = useContext(userContext);

  const {
    // activateRouting,
    pageStage,
    // openConfirmation,
    // closeConfirmation,
  } = usePageManager({
    defaultHandleApiError: {
      returnPath: '/pricing',
      handledErrors: [],
    },
  });

  // const handleSelect = (plan) => {
  //   if ( plan.id === 'free' ) {
  //     if (!userState?.isLoggedIn) {
  //       activateRouting('/sign-up');
  //     } else {
  //       activateRouting(appConfig?.authorizedUserHome || '/my-account');
  //     }
  //     return;
  //   }

  //   if (userState?.isLoggedIn) {
  //     activateRouting(`/checkout?price_id=${ plan.price_id }`);
  //   } else {
  //     openConfirmation({
  //       content: (
  //         <Stack alignItems="center" textAlign="center">
  //           <Typography gutterBottom variant="h2" color="primary">
  //             Thank you!
  //           </Typography>
  //           <Typography mb={ 3 }>
  //             However, before you can upgrade, you need to log in or create an account.
  //           </Typography>
  //           <AuthCtaButtons handleClick={ closeConfirmation } returnPath={ `/checkout?price_id=${ plan.price_id }` } />
  //         </Stack>
  //       ),
  //       primaryButtonText: 'Close',
  //       removeSecondaryAction: true,
  //     });
  //   }
  // };

  return (
    <>
      <L.div paddingX={ 2 } paddingBottom={ 2 } minWidth="100%">
        <PageHead title="Pricing" />

        {pageStage !== 'completed' && (
          <>
            <L.h1 marginTop={ 1 } color="primary" textAlign="center">
              Pricing
            </L.h1>
            <br />
          </>
        )}

        Looks like you found this stub page. If you're worried about this application costing money after beta, don't be!
        My goal is to keep everything as free as possible and only charge for high-cost features that power-users would want the most.
        I don't currently know what that'd look like, but it'll also be as cheap as possible. The goal is just enough to keep the lights on.
      
        {/* <div>
          <PricingTable
            plans={ appConfig?.subscriptionPlans }
            onSelect={ handleSelect }
          />
        </div> */}
      </L.div>
    </>
  );
};

export default Pricing;