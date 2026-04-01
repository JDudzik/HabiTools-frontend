import React, { createContext, useEffect, useRef } from 'react';
import { useImmerReducer } from 'use-immer';
import browserStorage from 'store';
import { usePersistState } from 'lib/hooks';
import { useInvalidateLogoutQueries } from './hooks/useInvalidateLogoutQueries';
import posthog from 'posthog-js';
import { useAxios } from 'lib/hooks/useAxios';


const initialState = {
  token: '',
  expires: 0,
  user: {},
  permissionsCheck: {
    has: () => false,
    oneOf: () => false,
    allOf: () => false,
    hasNot: () => true,
  },
  entitlementsCheck: {
    has: () => false,
    oneOf: () => false,
    allOf: () => false,
    hasNot: () => true,
  },
  isLoggedIn: false,
};

const checkIsLoggedIn = (userData) => { 
  // Check if the user exists in the state data
  const email = userData?.user?.email;
  const expires = userData?.expires;
  if (email && expires) {
    return true;
  }

  // Check if the user exists in the index DB
  const storedInBrowser = browserStorage.get('userContext');
  if (storedInBrowser?.userData?.email && storedInBrowser?.expires) {
    return true;
  }

  // If they are in neither, they aren't logged in
  return false;
};

const buildCheckMethods = (items = []) => {
  const values = Array.isArray(items) ? items : [];

  return {
    has: item => values.includes(item),
    oneOf: (candidates) => {
      const normalizedCandidates = Array.isArray(candidates) ? candidates : [ candidates ];
      return normalizedCandidates.some(candidate => values.includes(candidate));
    },
    allOf: (candidates) => {
      const normalizedCandidates = Array.isArray(candidates) ? candidates : [ candidates ];
      return normalizedCandidates.every(candidate => values.includes(candidate));
    },
    hasNot: item => !values.includes(item),
  };
};

export const userContext = createContext(initialState);

export const UserProvider = ({ children }) => {
  const invalidateLogoutQueries = useInvalidateLogoutQueries();
  const [ userData, setUserData, userStorageIsLoading ] = usePersistState('userContext', initialState);
  const hasLoadedUserFromStorage = useRef(false);
  const axios = useAxios();

  const [ userState, userDispatch ] = useImmerReducer((draft, action) => {
    switch (action.type) {
      case 'LOGOUT': {
        setUserData(initialState);
        invalidateLogoutQueries();
        posthog.reset();
        return initialState;
      }

      case 'SET_USER': {
        const { token, expires, user } = action.payload;
        const permissions = user?.permissions || [];
        const entitlements = user?.user_subscriptions?.[0]?.entitlements || [];

        draft.token = token;
        draft.expires = expires;
        draft.user = user;
        draft.permissionsCheck = buildCheckMethods(permissions);
        draft.entitlementsCheck = buildCheckMethods(entitlements);
        draft.isLoggedIn = checkIsLoggedIn(draft);
        setUserData(draft);
        if (draft?.user?.email) {
          posthog.identify(draft.user.email, {
            email: draft.user.email,
            first_name: draft.user.first_name,
            last_name: draft.user.last_name,
          });
        }
        return;
      }

      case 'REFRESH_USER': {
        axios
          .get('v1/auth/users/get_my_user')
          .then((res) => {
            if (res.data?.id) {
              userDispatch({ type: 'SET_USER', payload: {
                ...userState,
                user: res.data,
              }});
            }
          })
          .catch(() => {});
        return;
      }

      default: {
        throw new Error();
      }
    }
  }, initialState);


  // On initial load, we want to check if there's user data in storage and set it in the context if there is.
  // We also want to make sure this only runs once, which is why we use the hasLoadedUserFromStorage ref.
  useEffect(() => {
    if (!hasLoadedUserFromStorage.current && !userStorageIsLoading) {
      userDispatch({ type: 'SET_USER', payload: userData });
      hasLoadedUserFromStorage.current = true;
    }
  }, [ setUserData, userData, userDispatch, userState, userStorageIsLoading ]);

  // When the user first opens the app and are logged in,
  useEffect(() => {
    if (userState?.user?.id) {
      userDispatch({ type: 'REFRESH_USER' } );
    }
  }, [ userDispatch, userState?.user?.id ]);

  // On initial load, set an interval to refresh the user's data every 15 minutes.
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (userState?.user?.id) {
        userDispatch({ type: 'REFRESH_USER' } );
      }
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(intervalId);
  }, [ userState?.user?.id, userDispatch ]);

  return <userContext.Provider value={{ userState, userDispatch }}>{ children }</userContext.Provider>;
};
