export const isErrorIgnored = (message) => {
  const messagesToIgnore = [
    'The user aborted a request', // "AbortError: The user aborted a request."
    'Failed to fetch',            // "TypeError: Failed to fetch"
  ];

  return typeof message !== 'string'
    ? false
    : messagesToIgnore.some(term => message.toLowerCase().indexOf(term.toLowerCase()) !== -1);
};
