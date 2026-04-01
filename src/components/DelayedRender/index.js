import React, { useEffect, useState } from 'react';
import { L } from 'components';


export const DelayedRender = ({ delay = 250, onSetVisible, children }) => {
  const [ visible, setVisible ] = useState(false);

  useEffect(() => {
    if (onSetVisible) {
      onSetVisible?.(false);
    }
    const timer = setTimeout(() => {
      setVisible(true);
      if (onSetVisible) {
        onSetVisible?.(true);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [ delay, onSetVisible ]);

  return (
    <L.div
      aria-hidden={ visible ? undefined : false }
      sx={ visible ? undefined : {
        visibility: 'hidden',
        pointerEvents: 'none',
        userSelect: 'none',
        display: 'inline-block',
        width: '100%',
        height: 'auto',
      } }
    >
      {children}
    </L.div>
  );
};
