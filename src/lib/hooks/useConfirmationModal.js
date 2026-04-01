import { useContext, useMemo, useCallback } from 'react';
import { confirmationModalContext } from 'lib/contexts/ConfirmationModalContext';


export const useConfirmationModal = () => {
  const { modalState, modalDispatch } = useContext(confirmationModalContext);

  const openConfirmation = useCallback((payload) => {
    modalDispatch({ type: 'OPEN_MODAL', payload });
  }, [ modalDispatch ]);

  const updateConfirmation = useCallback((payload) => {
    modalDispatch({ type: 'UPDATE_MODAL', payload });
  }, [ modalDispatch ]);

  const closeConfirmation = useCallback(() => {
    modalDispatch({ type: 'CLOSE_MODAL' });
  }, [ modalDispatch ]);

  return useMemo(() => ({
    modalState,
    openConfirmation,
    updateConfirmation,
    closeConfirmation,
  }), [ modalState, openConfirmation, updateConfirmation, closeConfirmation ]);
};