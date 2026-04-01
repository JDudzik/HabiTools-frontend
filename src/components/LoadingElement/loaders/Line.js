import { styled, useTheme } from '@mui/material/styles';
import { css } from '@emotion/react';
import ContentLoader from 'react-content-loader';

const DEFAULT_HEIGHT = 13;

const LoaderWrapper = styled(ContentLoader)`
  width: 100%;

  ${ p => p.maxWidth && css` 
    max-width: ${ p.maxWidth };
  ` }
  ${ p => p.height && css` 
    height: ${ p.height || `${ DEFAULT_HEIGHT }px` };
  ` }
`;


export const Line = ({ visible, ...props }) => {
  const { palette } = useTheme();

  return (
    <LoaderWrapper
      height={ DEFAULT_HEIGHT }
      width={ 100 }
      speed={ 1 }
      backgroundColor={ visible ? palette.misc.skeletonBackground : 'rgba(0, 0, 0, 0)' }
      foregroundColor={ visible ? palette.misc.skeletonForeground : 'rgba(0, 0, 0, 0)' }
      { ...props }
    >
      <rect x="0" y="0" rx={ 2 } ry={ 3 } width="100%" height={ props?.height || DEFAULT_HEIGHT } />
    </LoaderWrapper>
  );
};
