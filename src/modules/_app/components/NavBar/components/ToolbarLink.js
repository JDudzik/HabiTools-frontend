import React, { useState } from 'react';
import { styled } from '@mui/material/styles';

// Visuals (Components, Modules)
import { Link } from 'components';
import { Button, Menu } from '@mui/material';
import { NavIcon } from './NavIcon';

// Logic (Utils, Contexts, APIs)



const ButtonStyle = styled(Button)`
  height: 100%;
  width: 100%;
  margin-left: 0.5em;

  .MuiButton-label {
    display: flex;
    justify-content: flex-start;
    text-transform: none;
  }
`;

const MenuStyled = styled(Menu)`
  .MuiPaper-root {
    margin-left: 0.5em;
    margin-top: -1em;
    padding-right: 1em;
  }

  .MuiList-root {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
`;



/* Note: We're using "forwardRef" here simply to stop an error about not passing refs properly. */
export const ToolbarLink = React.forwardRef((props, ref) => { // eslint-disable-line no-unused-vars
  const { onClick, text, link, children, disabled, type, ariaLabel, isLinkPermitted, closeMenusArray = []} = props;
  const [ menuAnchor, setMenuAnchor ] = useState(null);

  const menuClose = () => { setMenuAnchor(null); };
  const newCloseMenusArray = [ menuClose, ...closeMenusArray ];
  const closeMenuStack = () => newCloseMenusArray.forEach(menuCloser => menuCloser());

  const handleButtonPress = (event) => {
    if (children) { setMenuAnchor(event.currentTarget); }
    if (onClick) { onClick(props); }
    if (link && closeMenusArray) { closeMenuStack(); }
  };

  const RenderedLink = !disabled && link
    ? Link
    : 'div';

  return (
    <>
      <RenderedLink href={ link }>
        <ButtonStyle
          variant={ type === 'cta' ? 'contained' : 'text' }
          color={ type === 'cta' ? 'secondary' : 'inherit' }
          disabled={ disabled }
          aria-label={ ariaLabel || `button ${ text }` }
          aria-haspopup={ children ? 'true' : 'false' }
          startIcon={ props.icon && <NavIcon icon={ props.icon } /> }
          onClick={ handleButtonPress }
        >
          {text}
          {children && <NavIcon icon="ArrowDropDown" />}
        </ButtonStyle>
      </RenderedLink>

      {children && (
        <MenuStyled
          keepMounted
          open={ !!menuAnchor }
          anchorEl={ menuAnchor }
          onClose={ closeMenuStack }
        >
          {children.map((link) => {
            if (isLinkPermitted && !isLinkPermitted(link)) { return undefined; }
            return (
              <div key={ link.key || link.text + link.link }>
                <ToolbarLink
                  { ...link }
                  closeMenusArray={ newCloseMenusArray }
                  isLinkPermitted={ isLinkPermitted }
                />
              </div>
            );
          })}
        </MenuStyled>
      )}
    </>
  );
});
ToolbarLink.displayName = 'ToolbarLink';
