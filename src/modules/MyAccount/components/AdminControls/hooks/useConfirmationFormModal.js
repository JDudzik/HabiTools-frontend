import { useCallback } from 'react';


export const useConfirmationFormModal = ({ openConfirmation, updateConfirmation }) => {
  const openFormModal = useCallback((config) => {
    const {
      initialState,
      renderContent,
      onSubmit,
      getPrimaryButtonText,
      ...confirmationProps
    } = config;

    let modalState = initialState;

    const handleStateChange = (changes) => {
      modalState = {
        ...modalState,
        ...changes,
      };

      updateConfirmation({
        content: renderContent(modalState, handleStateChange),
        primaryButtonText: getPrimaryButtonText(modalState),
      });
    };

    openConfirmation({
      ...confirmationProps,
      content: renderContent(initialState, handleStateChange),
      primaryButtonText: getPrimaryButtonText(initialState),
      onRequestSubmit: () => onSubmit(modalState),
    });
  }, [ openConfirmation, updateConfirmation ]);

  return {
    openFormModal,
  };
};