import React, { createContext } from 'react';
import { useImmerReducer } from 'use-immer';
import linkModifierHelpers from './helpers/linkModifierHelpers';


const initialState = {
  primaryLinks: [],
  contextLinks: [],
  options: {
    systemAlertOpen: true,
    showSystemAlertButton: false,
  },
};

export const navigationContext = createContext(initialState);

export const NavigationProvider = ({ children }) => {
  const [ navigationState, navigationDispatch ] = useImmerReducer((draft, action) => {
    switch (action.type) {
      case 'RESET_PRIMARY_LINKS': {
        draft.contextLinks = [];
        return;
      }

      case 'RESET_CONTEXT_LINKS': {
        draft.contextLinks = [];
        return;
      }

      case 'MODIFY_PRIMARY_LINKS': {
        const existingLinks = draft.primaryLinks;
        const newLinks = action.payload(existingLinks, { ...linkModifierHelpers });
        if (!newLinks) { return; }
        const dedupedLinks = linkModifierHelpers.removeDuplicateLinks(newLinks);
        draft.primaryLinks = dedupedLinks;
        return;
      }

      case 'MODIFY_CONTEXT_LINKS': {
        const existingLinks = draft.contextLinks;
        const newLinks = action.payload(existingLinks, { ...linkModifierHelpers });
        if (!newLinks) { return; }
        const dedupedLinks = linkModifierHelpers.removeDuplicateLinks(newLinks);
        draft.contextLinks = dedupedLinks;
        return;
      }

      case 'TOGGLE_OPTION': {
        const { option, setTo } = action.payload;
        if (setTo !== undefined) { draft.options[option] = !!setTo; } // If setTo is defined, set the option to that value
        if (setTo === undefined) { draft.options[option] = !draft.options[option]; } // If setTo is not defined, toggle the option
        return;
      }

      default: {
        throw new Error();
      }
    }
  }, initialState);

  return <navigationContext.Provider value={{ navigationState, navigationDispatch }}>{ children }</navigationContext.Provider>;
};
