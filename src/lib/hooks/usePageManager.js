import { useState, useEffect, useCallback } from 'react';
import { usePageError } from './usePageError';
import { useRouting } from './useRouting';
import { useConfirmationModal } from './useConfirmationModal';

/**
 * @typedef {Object} PageManagerConfig
 * @property {Object} defaultHandleApiError - Default config for API error handling.
 * @property {string} defaultHandleApiError.returnPath - Path to redirect to on certain API errors.
 * @property {Array} defaultHandleApiError.handledErrors - List of error statuses to handle with the default handler.
 * @property {boolean} defaultHandleApiError.skipPageStage - If true, will not set page stage to 'error' on handled errors.
 * @property {string} defaultRoutingPath - Default path for routing actions.
 * @property {string} defaultPageStage - Initial page stage ('loading', 'main', 'error').
 * @property {boolean} apiIsLoading - External loading state from API calls to automatically manage page stages.
 * @property {Object} apiErrors - External error state from API calls to automatically manage page stages.
 */

/**
 * @typedef {Object} PageManagerReturn
 * @property {function(forcedPath=, mode=): void} activateRouting - Function to trigger route changes. Accepts an optional path override.
 * @property {string} pageStage - Current stage of the page.
 * @property {function(string): void} setPageStage - Function to manually set the page stage.
 * @property {Object} pageError - Current API error state for the page.
 * @property {function(errorStatus, errorMessage): void} setPageError - Sets the API error state and automatically updates page stage to 'error'. Empty clears the error.
 * @property {function({
 *     error: ApiErrorObject,
 *     activateRouting?: ActivateRouting,
 *     returnPath?: string,
 *     handledErrors?: string[],
 *     shouldSetError?: boolean
 * }): {status: string, message: string}} handleApiError - Handles API errors using the default config options defined in the hook. Also sets page stage to 'error' unless explicitly skipped.
 * @property {function({
 *   color?: string,
 *   title?: string,
 *   content?: string,
 *   primaryButtonText?: string,
 *   secondaryButtonText?: string,
 *   onRequestClose?: function,
 *   onRequestSubmit?: function,
 *   removeSecondaryAction?: boolean
 * }): void} openConfirmation - Function to open a confirmation modal with specific configuration.
 * @property {function({
 *   color?: string,
 *   title?: string,
 *   content?: string,
 *   primaryButtonText?: string,
 *   secondaryButtonText?: string,
 *   onRequestClose?: function,
 *   onRequestSubmit?: function,
 *   removeSecondaryAction?: boolean
 * }): void} updateConfirmation - Updates the content of the currently open confirmation modal.
 * @property {function(): void} closeConfirmation - Closes the confirmation modal.
 */

/**
 * Hook to manage the management of pages (page stages, routing, error handling, modals, etc) in a standardized way across the app.
 *
 * @param {PageManagerConfig} config - Configuration options for the page manager.
 * @property {Object} defaultHandleApiError - Default config for API error handling.
 * @property {String} defaultHandleApiError.returnPath - Path to redirect to on certain API errors.
 * @property {Array} defaultHandleApiError.handledErrors - List of error statuses to handle with the default handler.
 * @property {Boolean} defaultHandleApiError.skipPageStage - If true, will not set page stage to 'error' on handled errors.
 * @property {String} defaultRoutingPath - Default path for routing actions.
 * @property {String} defaultPageStage - Initial page stage ('loading', 'main', 'error').
 * @property {Boolean} apiIsLoading - External loading state from API calls to automatically manage page stages.
 * @property {Object} apiErrors - External error state from API calls to automatically manage page stages.
 *
 * ---
 * @returns {PageManagerReturn}
 * ```
 * {
 *   activateRouting: Function, // Function to trigger route changes.
 *   pageStage: String, // Current stage of the page ('loading', 'main', 'error').
 *   setPageStage: Function, // Function to manually set the page stage.
 *   pageError: Object, // Current API error state for the page.
 *   setPageError: Function, // Function to set the API error state and automatically update page stage to 'error'.
 *   handleApiError: Function, // Function to handle API errors using the default config options defined in the hook.
 *   openConfirmation: Function, // Function to open a confirmation modal.
 *   updateConfirmation: Function, // Function to update the content of the confirmation modal.
 *   closeConfirmation: Function, // Function to close the confirmation modal.
 * }
 * ```
 */
export const usePageManager = (config) => {
  const {
    defaultHandleApiError,
    defaultRoutingPath,
    defaultPageStage,
    apiIsLoading,
    apiErrors,
  } = config;

  const [ pageError, setPageError, handleApiError ] = usePageError();
  const [ activateRouting ] = useRouting(defaultRoutingPath || '');
  const [ lastInternalPageStage, setLastInternalPageStage ] = useState(defaultPageStage || 'loading');
  const [ pageStage, setPageStage ] = useState(defaultPageStage || 'loading');
  const { openConfirmation, updateConfirmation, closeConfirmation } = useConfirmationModal();

  const withDefaultHandleApiError = useCallback((config) => {
    handleApiError({
      activateRouting,
      returnPath: defaultHandleApiError?.returnPath,
      handledErrors: defaultHandleApiError?.handledErrors || [],
      ...config,
    });
    if (!defaultHandleApiError?.skipPageStage || !config?.skipPageStage) {
      setPageStage('error');
      setLastInternalPageStage('error');
    }
  }, [ activateRouting, defaultHandleApiError, handleApiError ]);

  const setPageErrorPlusStage = useCallback((errorStatus, errorMessage) => {
    setPageError(errorStatus, errorMessage);
    if (errorStatus || errorMessage) {
      setPageStage('error');
      setLastInternalPageStage('error');
    }
  }, [ setPageError ]);

  // Automatically manage page stages based on API loading and error states
  useEffect(() => {
    // If API is loading and we're not already showing the loading stage, switch to loading
    if (apiIsLoading && !apiErrors && lastInternalPageStage !== 'loading') {
      setPageError();
      setPageStage('loading');
      setLastInternalPageStage('loading');
    }
    // If we have API errors and we're not already showing the error stage, handle the error and switch to error stage
    if (apiErrors && lastInternalPageStage !== 'error') {
      handleApiError({
        error: apiErrors,
        activateRouting: activateRouting,
        returnPath: defaultHandleApiError?.returnPath,
        handledErrors: defaultHandleApiError?.handledErrors || [],
      });
      setPageStage('error');
      setLastInternalPageStage('error');
    }
    // If we have no API errors and we're not already showing the main stage, clear any page error and switch to main stage
    if (!apiIsLoading && !apiErrors && !pageError?.status && lastInternalPageStage !== 'main') {
      setPageError();
      setPageStage('main');
      setLastInternalPageStage('main');
    }
  }, [ apiIsLoading, apiErrors, handleApiError, activateRouting, defaultHandleApiError, pageError, lastInternalPageStage, setPageError ]);

  return {
    activateRouting,
    pageStage,
    setPageStage,
    pageError,
    setPageError: setPageErrorPlusStage,
    handleApiError: withDefaultHandleApiError,
    openConfirmation,
    updateConfirmation,
    closeConfirmation,
  };
};
