import { useEffect } from 'react';
import { styled } from '@mui/material/styles';

import { LoadingElement } from 'components';
import { useRouting } from 'lib/hooks';


const LoadingWrapper = styled('div')`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  margin: 4em 3em;
  min-height: 44px;
  min-width: 44px;
`;


export const LoadingPage = (props) => {
  const [ activateRouting ] = useRouting();

  useEffect(() => {
    if (props.error) {
      activateRouting(`/something-went-wrong?status=load_failed&message=${ props.error.name }`, 'replace');
    }
  });


  return (
    <LoadingWrapper>
      <div>
        {props.error && (
          <div>
            foo
          </div>
        )}
      </div>
      <LoadingElement circular />
    </LoadingWrapper>
  );
};
