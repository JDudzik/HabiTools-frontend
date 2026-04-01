import { styled } from '@mui/material/styles';
import { Global, css } from '@emotion/react';
import { Paper } from '@mui/material';
import { SystemAlertMessage } from './SystemAlertMessage';


const globalStyles = p => css`
  body {
    &:after {
      content: '';
      background-color: ${ p.palette.misc.ignoredBackground };
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: -99;
    }

    p {
      color: ${ p.palette.text.black };
      margin: 0 0 0.375rem 0;
    }

    form {
      align-items: stretch;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;

      > *:not(:last-child) {
        margin-bottom: 1rem;
      }

      > button {
        align-self: flex-start;
      }
    }
  }
`;

const BodyPaper = styled(Paper)`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 1.5em 3em;
  max-width: 1500px;
  min-height: 10em;
  padding: 1em 1em;

  @media screen and (min-width: 1600px) {
    margin: 1.5em auto;
  }

  @media screen and (max-width: 600px) {
    margin: 1em;
    padding: 2%;
  }

  @media screen and (max-width: 380px) {
    margin: 0.75em 0.5em;
    padding: 2%;
  }

  & > main {
    width: 100%;
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const NavBarSpacing = styled('div')`
  height: 4em;

  @media screen and (max-width: 600px) {
    height: 3.5em;
  }
`;


export const RootStyles = (props) => {
  return (
    <>
      <Global
        styles={ globalStyles }
      />

      <NavBarSpacing />
      <SystemAlertMessage />

      <BodyPaper>
        {props.children}
      </BodyPaper>
    </>
  );
};
