import { useState, useCallback } from 'react';
import { handleMiscBackendError } from 'lib/utils/misc';
import { useMutateSubmitError } from 'lib/api/methods/errorApi';


/**
 * Custom hook for managing page-level API errors.
 * 
 * @param {String} [initialStatus] - Optional initial error status.
 * @param {String} [initialMessage] - Optional initial error message.
 * @returns {{
 *   pageError: { status: string, message: string },
 *   setPageError: (errorStatus: string, errorMessage: string) => void,
 *   handleApiError: (
 *     error: ApiErrorObject,
 *     activateRouting: ActivateRouting,
 *     returnPath: string,
 *     handledErrors: [string],
 *     shouldSetError: boolean
 *   ) => { status: string, message: string }
 * }}
 */
export const usePageError = (initialStatus, initialMessage) => {
  const [ pageError, setPageErrorInternal ] = useState({ status: initialStatus, message: initialMessage });
  const { mutate: mutateSubmitError } = useMutateSubmitError();

  const setPageError = useCallback((errorStatus, errorMessage) => {
    setPageErrorInternal({ status: errorStatus, message: errorMessage });
  }, []);

  const handleApiError = useCallback((properties) => {
    const {
      error,
      activateRouting,
      returnPath,
      handledErrors = [],
      shouldSetError = true,
    } = properties;

    const normalizedError = {
      status: error?.response?.data?.status || error?.status || error?.code,
      message: error?.response?.data?.message || error?.message,
    };

    // For safety, make sure that the status is uppercase, regardless of it's source.
    normalizedError.status = `${ normalizedError.status }`.toUpperCase();

    const status = handledErrors.includes(normalizedError.status)
      ? normalizedError.status
      : 'OTHER_ERROR';

    const message = normalizedError.message || 'Unknown Error';

    // Note: the method below ignores values in "handledErrors", essentially the opposite of above.
    const miscErrorStatus = handleMiscBackendError({
      mutateSubmitError,
      errorObject: normalizedError,
      activateRouting,
      returnPath,
      excludedErrors: handledErrors,
    });

    // This block only gets fired if "handleMiscBackendError" failed/canceled.
    if (!miscErrorStatus && shouldSetError) {
      if (status === 'OTHER_ERROR') {
        mutateSubmitError({
          source: 'usePageError.handleApiError',
          message: 'Unknown Error',
          message_json: {
            error: error || 'No error object',
            returnPath,
            handledErrors,
          },
        });

        if (!handledErrors.includes('OTHER_ERROR')) {
          const lowerCaseStatus = (status?.toLowerCase()) || 'other_error';
          const stringifiedMessage = `status: ${ normalizedError?.status }, message: ${ JSON.stringify(message) || '' }`;
          activateRouting(`/something-went-wrong?status=${ lowerCaseStatus }&message=${ stringifiedMessage }&return_path=${ encodeURIComponent(returnPath) }`);
        }
      }
      setPageError(status, message);
    }

    return {
      status: miscErrorStatus || status,
      message,
    };
  }, [ mutateSubmitError, setPageError ]);

  return [
    pageError,
    setPageError,
    handleApiError,
  ];
};
