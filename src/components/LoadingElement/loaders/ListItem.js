import { styled, useTheme } from '@mui/material/styles';
import { css } from '@emotion/react';
import ContentLoader from 'react-content-loader';


const LOADER_HEIGHT = 90;
const LoaderWrapper = styled(ContentLoader)`
  height: ${ LOADER_HEIGHT }px;

  ${ p => p.maxWidth && css`
    max-width: ${ p.maxWidth };
  ` }
`;


export const ListItem = ({ visible, ...props }) => {
  const { palette } = useTheme();

  return (
    <LoaderWrapper
      height={ LOADER_HEIGHT }
      width={ 300 }
      speed={ 1 }
      backgroundColor={ visible ? palette.misc.skeletonBackground : 'rgba(0, 0, 0, 0)' }
      foregroundColor={ visible ? palette.misc.skeletonForeground : 'rgba(0, 0, 0, 0)' }
      { ...props }
    >
      <rect x="30" y="20" rx="20" ry="20" width="2.65em" height="2.65em" />
      <rect x="85" y="20" rx="4" ry="4" width="56%" height="1em" />
      <rect x="85" y="40" rx="4" ry="4" width="35%" height="0.7em" />
    </LoaderWrapper>
  );
};
