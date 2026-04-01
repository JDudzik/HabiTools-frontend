import { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import { Drawer, AppBar, Toolbar, Button } from '@mui/material';
import { DrawerLink, NavIcon, ToolbarLink, NotificationsButton } from './components';
import { Link, L } from 'components';
import { navigationContext } from 'lib/contexts/NavigationContext';
import { userContext } from 'lib/contexts/UserContext';


const HorizontalSeperator = styled('div')`
  background-color: ${ p => p.theme.palette.text.lightGrey };
  margin: 0.7em;
  min-height: 1px;
  width: auto;
`;

const NavToolbarStyle = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
`;

const NavLeft = styled('div')`
  display: flex;
  justify-content: flex-start;
`;

const NavRight = styled('div')`
  display: flex;
  justify-content: flex-end;
`;

const DrawerToolbarStyle = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
`;

const DrawerLinksStyle = styled('div')`
  padding-right: 1em;
`;

const IconTextButton = styled(Button)`
  .MuiButton-label {
    display: flex;
    flex-direction: column;
    justify-content: center;

    >div {
      font-size: 0.6rem;
      font-weight: bold;
    }
  }
`;

const DynamicMenuLinks = styled('div')`
  display: flex;
  justify-content: flex-end;
  margin-right: 1rem;

  >div {
    display: flex;
    justify-content: center;
    margin-right: 0.15rem;
  }

  >div:nth-of-type(n+11) {
    display: none;
  }

  @media screen and (max-width: 1920px) {
    >div:nth-of-type(n+7) {
      display: none;
    }
  }

  @media screen and (max-width: 1280px) {
    >div:nth-of-type(n+5) {
      display: none;
    }
  }

  @media screen and (max-width: 960px) {
    margin-right: 0;

    >div:nth-of-type(n+4) {
      display: none;
    }
  }

  @media screen and (max-width: 780px) {
    >div {
      display: none;
    }
  }
`;


export const NavBar = () => {
  const { userState } = useContext(userContext);
  const { navigationState } = useContext(navigationContext);
  const [ drawerOpen, setDrawerOpen ] = useState(false);
  const [ isUserLoggedIn, setUserLoggedIn ] = useState(false);

  const isLinkPermitted = useCallback((linkData, location) => {
    // location:
    if (linkData.location && linkData.location !== location) { return false; }

    // requiredAuthState:
    const reqAuthState = linkData.requiredAuthState;
    if (reqAuthState === true && !isUserLoggedIn) { return false; }
    if (reqAuthState === false && isUserLoggedIn) { return false; }

    // requiredPermission:
    const reqPermission = linkData.requiredPermission;
    if (reqPermission && !userState?.permissionsCheck.has(reqPermission)) { return false; }

    return true;
  }, [ isUserLoggedIn, userState ]);

  const loggedInResult = userState?.isLoggedIn;
  useEffect(() => {
    setUserLoggedIn(loggedInResult);
  }, [ loggedInResult ]);

  const memodToolbarLinks = useMemo(() => (
    navigationState?.primaryLinks.map(link => isLinkPermitted(link, 'navBar') && (
      <div key={ link.key || link.text + link.link }>
        <ToolbarLink
          isLinkPermitted={ link => isLinkPermitted(link, 'navBar') }
          { ...link }
        />
      </div>
    ))
  ), [ isLinkPermitted, navigationState?.primaryLinks ]);

  const memodDrawerPrimaryLinks = useMemo(() => (
    navigationState?.primaryLinks.map(link => isLinkPermitted(link, 'sideDrawer') && (
      <DrawerLink
        key={ link.key || link.text + link.link }
        userState={ userState }
        setDrawerOpen={ setDrawerOpen }
        isLinkPermitted={ link => isLinkPermitted(link, 'sideDrawer') }
        { ...link }
      />
    ))
  ), [ isLinkPermitted, navigationState?.primaryLinks, userState ]);

  const memodDrawerContextLinks = useMemo(() => (
    navigationState?.contextLinks.map(link => isLinkPermitted(link, 'sideDrawer') && (
      <DrawerLink
        key={ link.key || link.text + link.link }
        userState={ userState }
        setDrawerOpen={ setDrawerOpen }
        isLinkPermitted={ link => isLinkPermitted(link, 'sideDrawer') }
        { ...link }
      />
    ))
  ), [ isLinkPermitted, navigationState?.contextLinks, userState ]);

  return (
    <>
      <AppBar position="fixed" elevation={ 2 }>
        <NavToolbarStyle>

          <NavLeft>
            <IconTextButton color="inherit" aria-label="menu" onClick={ () => setDrawerOpen(true) }>
              <NavIcon icon="Menu" />
              <div>MENU</div>
            </IconTextButton>
          </NavLeft>

          <NavRight>
            <DynamicMenuLinks>
              { memodToolbarLinks}
            </DynamicMenuLinks>

            {!isUserLoggedIn && (
              <Link href="/sign-up">
                <IconTextButton color="inherit" aria-label="menu">
                  <NavIcon icon="PersonAdd" />
                  <div>SIGN-UP</div>
                </IconTextButton>
              </Link>
            )}

            {isUserLoggedIn && (
              <NotificationsButton isUserLoggedIn={ isUserLoggedIn } />
            )}

            <Link href={ isUserLoggedIn ? '/my-account' : '/login' }>
              <IconTextButton color="inherit" aria-label="menu">
                <NavIcon icon="AccountCircle" />
                <div>{isUserLoggedIn ? 'ACCOUNT' : 'LOGIN'}</div>
              </IconTextButton>
            </Link>
          </NavRight>

          <Drawer
            open={ drawerOpen }
            ModalProps={{
              keepMounted: true,
            }}
            onClose={ () => setDrawerOpen(false) }
          >
            <AppBar position="static" elevation={ 0 }>
              <DrawerToolbarStyle>
                <L.h4>Menu</L.h4>
                <IconTextButton color="inherit" aria-label="close-menu" onClick={ () => setDrawerOpen(false) }>
                  <NavIcon icon="MenuOpen" />
                  <div>CLOSE</div>
                </IconTextButton>
              </DrawerToolbarStyle>
            </AppBar>
            <DrawerLinksStyle>
              { memodDrawerPrimaryLinks }
              {navigationState?.contextLinks.length ? (
                <HorizontalSeperator />
              ) : null}
              { memodDrawerContextLinks }
            </DrawerLinksStyle>
          </Drawer>

        </NavToolbarStyle>
      </AppBar>
    </>
  );
};
