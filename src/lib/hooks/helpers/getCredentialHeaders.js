import browserStorage from 'store';


export const getCredentialHeaders = () => {
  try {
    const userContext = browserStorage.get('userContext');
    if (userContext) {
      const token = userContext?.token;
      const email = userContext.user?.email;
      if (token && email) {
        return {
          'x-access-token': token,
          'x-key': email,
        };
      }
    }
  // eslint-disable-next-line no-unused-vars
  } catch (_error) {
    // Swallow this error as it's likely due to a null value in local storage.
  }

  return {};
};