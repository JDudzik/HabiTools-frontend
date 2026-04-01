import { useCallback } from 'react';
import { useRouter } from 'next/router';

export const useRouting = (defaultPath) => {
  const router = useRouter();

  const activateRouting = useCallback((forcedPath, mode = 'push') => {
    const queryStringPath = router.query.return_path;

    const path = forcedPath || queryStringPath || defaultPath;
    if (!path && (mode === 'replace' || mode === 'push') && process.env.NODE_ENV === 'development') {
      throw new Error('No path was provided to "activateRouting"');
    }

    if (mode === 'back') {
      return router.back(); // Same as "window.history.back()"
    }
    if (mode === 'forward') {
      return window.history.forward();
    }

    if (path) {
      if (mode === 'replace') {
        return router.replace(path);
      }
      if (mode === 'push') {
        return router.push(path);
      }
    }

    if (process.env.NODE_ENV === 'development') {
      throw new Error('Unable to execute routing in "activateRouting". Incorrect "path" and "mode" combination');
    }
  }, [ defaultPath, router ]);

  return [
    activateRouting,
  ];
};
