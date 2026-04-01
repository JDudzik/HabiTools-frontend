import { styled, useTheme } from '@mui/material/styles';
import { css } from '@emotion/react';
import ContentLoader from 'react-content-loader';


const LOADER_HEIGHT = 300;
const LoaderWrapper = styled(ContentLoader)`
  height: ${ LOADER_HEIGHT }px;

  ${ p => p.maxWidth && css`
    max-width: ${ p.maxWidth };
  ` }
`;


export const SimpleArticle = ({ visible, ...props }) => {
  const { palette } = useTheme();

  return (
    <LoaderWrapper
      height={ LOADER_HEIGHT }
      width={ 400 }
      speed={ 1 }
      backgroundColor={ visible ? palette.misc.skeletonBackground : 'rgba(0, 0, 0, 0)' }
      foregroundColor={ visible ? palette.misc.skeletonForeground : 'rgba(0, 0, 0, 0)' }
      { ...props }
    >
      <rect x="0" y="13" rx="4" ry="4" width="100%" height="9" />
      <rect x="0" y="29" rx="4" ry="4" width="25%" height="8" />
      <rect x="0" y="50" rx="4" ry="4" width="100%" height="10" />
      <rect x="0" y="65" rx="4" ry="4" width="100%" height="10" />
      <rect x="0" y="79" rx="4" ry="4" width="25%" height="10" />
      <rect x="0" y="99" rx="5" ry="5" width="100%" height="200" />
    </LoaderWrapper>
  );
};
