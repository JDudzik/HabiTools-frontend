/* eslint-disable react/display-name */
import { useState } from 'react';
import {
  Divider,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import { SquareIconButton } from '../SquareIconButton';
import { L } from '../L';
import { Link } from '../Link';


export const PopoutMenuButton = (props) => {
  const [ anchorEl, setAnchorEl ] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => setAnchorEl(null);

  const handleMenuClose = (onCloseProp) => {
    closeMenu();
    if (onCloseProp) { onCloseProp(); }
  };

  const ButtonComponent = (!props.buttonChild && props.buttonProps?.startIcon) ? SquareIconButton : Button;

  return (
    <L.div sx={ props.sx }>
      <ButtonComponent
        id="basic-button"
        aria-controls={ isOpen ? 'basic-menu' : undefined }
        aria-haspopup="true"
        aria-expanded={ isOpen ? 'true' : undefined }
        onClick={ handleClick }
        { ...(props.buttonProps || []) }
      >
        { props.buttonChild }
      </ButtonComponent>
      <Menu
        id="basic-menu"
        anchorEl={ anchorEl }
        open={ isOpen }
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        { ...(props.menuProps || []) }
        onClose={ () => handleMenuClose(props?.menuProps?.onClose) }
      >
        {props.menuItems?.map((menuItem, index) => {
          if (menuItem.isDivider) {
            return (
              <Divider key={ `divider-${ index }` } />
            );
          }
          if (menuItem.hidden) {
            return null;
          }

          const handleClick = () => {
            if (menuItem.onClick) {
              closeMenu();
              if (menuItem.onClick) { menuItem.onClick(); }
            }
          };

          const renderedComponent = () => {
            if (menuItem.url) {
              return (props => (
                <Link href={ menuItem.url }>
                  <ListItemButton { ...props } />
                </Link>
              ));
            }
            return undefined;
          };

          return (
            <MenuItem
              { ...(menuItem.props || []) }
              key={ menuItem.key }
              component={ renderedComponent() }
              onClick={ handleClick }
            >
              <>
                {menuItem.iconEl && (<ListItemIcon>{menuItem.iconEl}</ListItemIcon>)}
                {menuItem.child || (<ListItemText>{menuItem.text}</ListItemText>)}
                {menuItem.secondaryText && (
                  <L.p2 color="text.secondary" ml={ 4 }>
                    {menuItem.secondaryText}
                  </L.p2>
                )}
              </>
            </MenuItem>
          );
        })}
      </Menu>
    </L.div>
  );
};
