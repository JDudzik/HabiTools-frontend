import { useContext, useState } from 'react';
import { PageHead, L, PopoutMenuButton, DelayedRender, AuthCtaButtons } from 'components';
import {
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  Box,
  Fade,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { navigationContext } from 'lib/contexts/NavigationContext';
import { ImageSection } from './components';


const Home = () => {
  const [ isHomeVisible, setIsHomeVisible ] = useState(false);
  const { navigationDispatch } = useContext(navigationContext);

  return (
    <>
      <PageHead title="Home" />
      <PopoutMenuButton
        buttonProps={{
          startIcon: (<MoreVertIcon />),
          variant: 'outlined',
        }}
        buttonChild="Popout Menu Example"
        menuProps={{
          onClose: () => console.debug('Menu got closed'),
        }}
        menuItems={ [{
          key: 'hello',
          iconEl: (<MoreVertIcon fontSize="small" />),
          text: 'hello world!',
          secondaryText: 'ctrl+v',
          onClick: () => console.debug('clicked "hello world"'),
          props: { dense: true },
        }, {
          key: 'add-context-link',
          iconEl: (<MoreVertIcon fontSize="small" />),
          text: 'Add context link',
          secondaryText: 'Test link',
          onClick: () => navigationDispatch({
            type: 'MODIFY_CONTEXT_LINKS',
            payload: (existingLinks, helpers) => helpers.addLink(existingLinks, {
              text: 'Test link',
              link: '/test',
              icon: 'Home',
            }),
          }),
        },
        {
          isDivider: true,
        }, {
          key: 'more',
          child: (
            <>
              <ListItemIcon>
                <MoreVertIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Custom rendered item</ListItemText>
            </>
          ),
          onClick: () => console.debug('clicked "Custom rendered item"'),
        }] }
      />

      <DelayedRender onSetVisible={ setIsHomeVisible }>
        <Fade in={ isHomeVisible } timeout={ 500 }>
          <Stack
            spacing={{ xxs: 10, md: 12 }}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ paddingY: 4 }}
          > 
            <Stack
              data-section="section1"
              spacing={{ xxs: 4, md: 6 }}
              width="100%"
              maxWidth="60em"
              direction={{ xxs: 'column-reverse', md: 'row-reverse' }}
              alignItems="center"
              textAlign={{ xxs: 'center', md: 'left' }}
            >
              <Box flex={ 1 }>
                <Typography mb={ 1 } variant="h1" color="primary">
                  Welcome to The App
                </Typography>
                <Typography mb={ 2 } variant="h3" color="text.secondary">
                  Simple, Powerful Tools
                </Typography>
                <Typography mb={ 2 }>
                  Discover a platform designed to help you organize, track, and manage your information with ease.
                  Enjoy a clean interface and flexible features for any use case—personal, professional, or collaborative.
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
                  src="https://fastly.picsum.photos/id/851/340/340.jpg?hmac=Qv7PKOQJFwzEo7VQbEMUZEpRLjN-rOopzDlzuLbN-aA"
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

            <ImageSection
              imageSrc="https://fastly.picsum.photos/id/851/340/340.jpg?hmac=Qv7PKOQJFwzEo7VQbEMUZEpRLjN-rOopzDlzuLbN-aA"
              imageAlt="Organize your information"
              heading="Organize Your Way"
              paragraphs={ [
                'Create custom categories to organize your data, tasks, or projects. Adapt the platform to fit your workflow and stay on top of what matters most.',
                'Flexible organization tools help you keep everything clear and accessible, whether you\'re managing a team or your own daily routine.',
                'Advanced features like bulk actions, tagging, and search make management simple and effective.',
              ] }
            />

            <ImageSection
              reverseOrder={ true }
              imageSrc="https://fastly.picsum.photos/id/851/340/340.jpg?hmac=Qv7PKOQJFwzEo7VQbEMUZEpRLjN-rOopzDlzuLbN-aA"
              imageAlt="Tracking and collaboration"
              heading="Track and Collaborate"
              paragraphs={ [
                'Keep detailed records of your activities, tasks, or projects. Add, edit, and categorize items effortlessly. View your history at a glance and understand your progress.',
                'Collaborate with others by sharing access. Invite teammates, friends, or family to work together and stay in sync.',
                'Our intuitive interface makes it easy to manage everything on the go, whether you\'re on your computer or mobile device.',
              ] }
            />

            <ImageSection
              imageSrc="https://fastly.picsum.photos/id/851/340/340.jpg?hmac=Qv7PKOQJFwzEo7VQbEMUZEpRLjN-rOopzDlzuLbN-aA"
              imageAlt="Community-focused app"
              heading="Built for You"
              paragraphs={ [
                'This platform is created to empower users and communities. There are no fees, subscriptions, or hidden costs.',
                'Your information stays private and secure. We don\'t share or sell your data. We hope you find this tool to be a useful addition to your journey.',
              ] }
            />

            <Stack
              spacing={ 3 }
              direction="column"
              alignItems="center"
              textAlign="center"
              sx={{ paddingY: 4 }}
            >
              <Typography variant="h3" color="primary" sx={{ fontWeight: 500 }}>
                Ready to get started?
              </Typography>
              <AuthCtaButtons />
            </Stack>
          </Stack>
        </Fade>
      </DelayedRender>
    </>
  );
};

export default Home;