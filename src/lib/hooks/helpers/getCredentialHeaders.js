import browserStorage from 'store';


export const getCredentialHeaders = () => {
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

  return {};
};