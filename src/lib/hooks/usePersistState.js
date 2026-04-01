import { useState, useEffect } from 'react';
import browserStorage from 'store';


export const usePersistState = (storageTitle, defaultState) => {
  const [ thisState, setThisState ] = useState(defaultState);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    const storedInBrowser = browserStorage.get(storageTitle);
    if (storedInBrowser) {
      setThisState(storedInBrowser);
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setNewState = (newState) => {
    browserStorage.set(storageTitle, newState);
    setThisState(newState);
  };

  return [ thisState, setNewState, isLoading ];
};
