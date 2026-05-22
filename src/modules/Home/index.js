import { useContext } from 'react';
import { PageHead, L, AuthCtaButtons, MarkdownMui, Link } from 'components';
import { Stack, Typography, Box, Button, Alert } from '@mui/material';
import { usePageManager } from 'lib/hooks';
import howWeSecureData from 'lib/data/howWeSecure.md';
import { useApiGetHabitica } from 'lib/api/methods/habiticaApi';
import { userContext } from 'lib/contexts/UserContext';



const Home = () => {
  const { userState } = useContext(userContext);
  const {
    openConfirmation,
  } = usePageManager({});

  // We prefetch Habitica data on the home page since this is the page most users will land on for now.
  useApiGetHabitica();

  const openHowWeSecureModal = () => {
    openConfirmation({
      content: (MarkdownMui.compiler(howWeSecureData)),
      primaryButtonText: 'Close',
      removeSecondaryAction: true,
    });
  };
  
  return (
    <>
      <PageHead title="Home" />

      <Stack
        spacing={{ xxs: 6, md: 8 }}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ paddingY: 4 }}
      > 
        {userState?.isLoggedIn && (
          <Alert
            severity="info"
            sx={{
              width: '100%',
              maxWidth: '60em',
              alignItems: 'center',
            }}
          >
            <L.h4>Tools can be found in the "Menu" at the top-left corner.</L.h4>
          </Alert>
        )}

        <Stack
          data-section="section1"
          spacing={{ xxs: 4, md: 6 }}
          width="100%"
          maxWidth="60em"
          direction={{ xxs: 'column-reverse', md: 'row-reverse' }}
          alignItems="start"
          textAlign={{ xxs: 'center', md: 'left' }}
        >
          <Box flex={ 1 }>
            <Typography mb={ 0 } variant="h1" color="primary">
              Welcome to HabiTools
            </Typography>
            <Typography mb={ 2 } variant="h3" color="secondary.dark">
              The <b>unofficial</b> suite of tools for Habitica
            </Typography>
            <Typography mb={ 2 }>
              HabiTools is a set of tools and automations for Habitica.
              The goal is to create a clean interface without requiring you to install or manage scripts yourself.
            </Typography>
            <Typography mb={ 2 }>
              <b>HabiTools is currently in beta.</b> Thanks for taking a look and for
              helping test it while the service is still being worked on. It's also open-source,
              so feel free to inspect the code and report any bugs/issues you find if you're technically inclined.
              <br />Github repos: <Link href="https://github.com/JDudzik/HabiTools-frontend">Frontend</Link>, <Link href="https://github.com/JDudzik/HabiTools-backend">Backend</Link>
            </Typography>
            <Typography mb={ 2 }>
              Security of your data is a core principle for HabiTools. We use your Habitica
              user data and API key to provide tools and automations,
              so the way we manage your data is extremely important. Your Habitica data is stored securely and carefully with
              modern encryption best practices in place.
              <Button onClick={ openHowWeSecureModal } >
                Learn how we keep your data secure
              </Button>
            </Typography>
            <Typography mb={ 2 }>
              Another principle is thoughtful use of the Habitica API. We take steps to reduce excessive and undue stress to their API.
              We want to avoid creating unnecessary load on Habitica's servers.
            </Typography>
            <Typography mb={ 2 }>
              Feedback during beta is incredibly helpful. While using HabiTools, please consider giving us your feedback on anything that's confusing,
              any bugs you encounter, or any features you'd like to see in the future. <Link href="/feedback">Give Feedback</Link>
            </Typography>
            <Typography mb={ 2 }>
              If you have questions, suggestions, or run into anything odd,
              use the feedback page or reach out to masterlink950 in
              either of the major Habitica Discord servers: <Link href="https://discord.com/invite/C36kxnAKSm">Habitica (unofficial)</Link> and <Link href="https://discord.com/invite/habitica-central-1136011016682098778">Habitica Central</Link>.
            </Typography>
            <AuthCtaButtons />
          </Box>
          <Box
            flex={{ xs: 0, md: 0.5 }}
            sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <L.img
              src="/images/marketing/habitools-logo-hero.jpg"
              alt="Bank accounts overview"
              sx={{
                width: { xxs: '80%', xs: '60%', sm: '45%', md: '90%' },
                maxWidth: '400px',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Box>
        </Stack>
      </Stack>
    </>
  );
};

export default Home;