import { useRef, useState, useEffect, useCallback } from 'react';

/**
 * useElementVisibility
 * @param {Object} options - IntersectionObserver options
 * @param {Element|null} options.root - The element that is used as the viewport for checking visibility
 * @param {string} options.rootMargin - Margin around the root
 * @param {number|number[]} options.threshold - Percentage of the target's visibility the observer's callback should trigger on
 * @returns {Object} { ref, isVisible, wasSeen }
 */
export const useElementVisibility = (options = {}) => {
  const elementRef = useRef(null);
  const [ isVisible, setIsVisible ] = useState(false);
  const [ wasSeen, setWasSeen ] = useState(false);

  const observerCallback = useCallback((entries) => {
    const entry = entries[0];
    setIsVisible(entry.isIntersecting);
    if (entry.isIntersecting) { setWasSeen(true); }
  }, []);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) { return; }

    const observer = new window.IntersectionObserver(observerCallback, options);
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [ observerCallback, options ]);

  return { ref: elementRef, isVisible, wasSeen };
};