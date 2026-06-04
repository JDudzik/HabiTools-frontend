export const handleMiscBackendError = (config) => {
  const {
    mutateSubmitError,
    errorObject,
    activateRouting,
    returnPath,
    excludedErrors = [],
  } = config;
  if (!errorObject) {
    throw new Error('"handleBackendError" method params: errorObject, [activateRouting, [returnPath, [excludedErrors]]]]');
  }

  let status = errorObject.status;
  let message = errorObject.message;
  if (errorObject?.json?.status) {
    status = errorObject.json.status;
    message = errorObject.json.message;
  } else if (errorObject?.message) {
    message = errorObject.message;
  }

  // Submit an error report to the backend if this is a status that should be reported
  const shouldSubmitReport = [ 'API_ERROR', 'INADEQUATE_PERMISSION', 'INVALID_URL' ].includes(status);
  if (shouldSubmitReport) {
    mutateSubmitError({
      source: 'handleMiscBackendError.shouldSubmitReport',
      message: `status: ${ status }`,
      message_json: errorObject,
    });
  }

  if (excludedErrors.includes(status)) { return; }


  // Errors pertaining to the user's token and/or credentials
  const requireFreshLoginStatuses = [ 'BAD_TOKEN_OR_KEY', 'TOKEN_EXPIRED', 'UNPROVIDED_KEY_OR_TOKEN', 'UNKNOWN_01' ];
  if (requireFreshLoginStatuses.includes(status)) {
    if (activateRouting) {
      const withReturnUrl = returnPath ? `&return_path=${ encodeURIComponent(returnPath) }` : '';
      activateRouting(`/login?logout=true${ withReturnUrl }`, 'replace');
    }
    return status;
  }


  // Errors that should simply redirect to the error page
  const errorPageStatuses = [
    'FAILED_TO_FETCH',   'USER_IS_DELETED',       'UNVERIFIED_EMAIL',
    'TOO_MANY_ATTEMPTS', 'INADEQUATE_PERMISSION', 'INVALID_CREDENTIALS',
    'API_ERROR',         'INVALID_URL',           'LOAD_FAILED',
    'ERR_NETWORK',       'UNAUTHORIZED_ACCESS',   'HCAPTCHA_VERIFICATION_FAILED',
    'DECRYPTION_FAILED', 'TOOL_ALREADY_ACTIVE',   'HABITICA_INVALID_CREDENTIALS',
  ];

  if (errorPageStatuses.includes(status)) {
    const lowerCaseStatus = status.toLowerCase();
    const jsonMessage = (JSON.stringify(message)) || '';
    const withReturnUrl = returnPath ? `&return_path=${ encodeURIComponent(returnPath) }` : '';
    activateRouting(`/something-went-wrong?status=${ lowerCaseStatus }&message=${ jsonMessage }${ withReturnUrl }`);
    return status;
  }

  // Only return a truthy if the error status exists and is being handled by one of the code blocks,
  // otherwise return nothing.
};
