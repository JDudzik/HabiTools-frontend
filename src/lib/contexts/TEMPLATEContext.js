import React, { createContext } from 'react';
import { useImmerReducer } from 'use-immer';

// Tasks for creating new context:
//    Duplicate and rename "TEMPLATEContext" to new context
//    Refactor "template" references to new context
//    Add new context initialization to "/src/features/_app/GlobalProviders.js"
//    Use the new context within components as desired!

const initialState = {
  name: '',
  age: '',
  callback: () => undefined,
};

export const templateContext = createContext(initialState);

export const TemplateProvider = ({ children }) => {
  const [ templateState, templateDispatch ] = useImmerReducer((draft, action) => {
    switch (action.type) {
      case 'SET_NAME': {
        draft.name = action.payload;
        return;
      }

      case 'SET_NEW_DATA': {
        draft.name = action.payload.name;
        draft.age = action.payload.age;
        draft.callback = action.payload.callback;
        return;
      }

      case 'RESET_DATA': {
        return initialState;
      }

      default: {
        throw new Error();
      }
    }
  }, initialState);

  return <templateContext.Provider value={{ templateState, templateDispatch }}>{ children }</templateContext.Provider>;
};
