import React, { createContext } from 'react';
import { useImmerReducer } from 'use-immer';

const initialState = {
  modal: {
    open: false,
    color: 'primary',
    title: '',
    content: '',
    primaryButtonText: 'Continue',
    secondaryButtonText: 'Cancel',
    onRequestClose: () => undefined,
    onRequestSubmit: () => undefined,
    removeSecondaryAction: false,
  },
};

export const confirmationModalContext = createContext(initialState);

export const ConfirmationModalProvider = ({ children }) => {
  const [ modalState, modalDispatch ] = useImmerReducer((draft, action) => {
    switch (action.type) {
      case 'OPEN_MODAL': {
        draft.modal = {
          ...initialState.modal,
          ...action.payload,
          open: true,
        };
        return;
      }

      case 'UPDATE_MODAL': {
        for (const key in action.payload) {
          if (Object.prototype.hasOwnProperty.call(action.payload, key)) {
            draft.modal[key] = action.payload[key];
          }
        }
        return;
      }

      case 'CLOSE_MODAL': {
        draft.modal.open = false;
        return;
      }
        
      default: {
        throw new Error();
      }
    }
  }, initialState);

  return <confirmationModalContext.Provider value={{ modalState, modalDispatch }}>{ children }</confirmationModalContext.Provider>;
};
