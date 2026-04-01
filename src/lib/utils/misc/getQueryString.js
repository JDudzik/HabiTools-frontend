export const getQueryString = (...params) => {
  if (typeof window === 'undefined') {
    throw new Error('Cannot use "getQueryString" within server-side logic');
  }

  const urlSearch = new URLSearchParams(window.location.search);
  return urlSearch.get(...params);
};
