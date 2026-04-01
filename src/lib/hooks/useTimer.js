import { useState, useRef, useEffect } from 'react';

/**
 * useTimer hook
 * @param {number} [defaultTime=0] - Default time in seconds
 * @returns {object} { timeRemaining, isTimerActive, activateTimer }
 */
export const useTimer = (defaultTime = 0) => {
  const [ timeRemaining, setTimeRemaining ] = useState(0);
  const [ isTimerActive, setIsTimerActive ] = useState(false);
  const timerRef = useRef(null);
  const defaultTimeRef = useRef(defaultTime);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const activateTimer = (duration) => {
    const time = typeof duration === 'number' ? duration : defaultTimeRef.current;
    setTimeRemaining(time);
    setIsTimerActive(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return {
    timeRemaining,
    isTimerActive,
    activateTimer,
  };
};
