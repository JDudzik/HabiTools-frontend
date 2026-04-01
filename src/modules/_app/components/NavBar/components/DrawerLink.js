import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import { NavIcon } from './NavIcon';
import { HiddenAccordion } from 'components/HiddenAccordion';
import { Link } from 'components/Link';


const ButtonStyle = styled(Button)`
  display: flex;
  justify-content: flex-start;
  width: 100%;

  .MuiButton-label {
    justify-content: flex-end;
    text-transform: none;
  }
`;

const DropdownIndicator = styled(NavIcon)`
  margin-left: 0;
  transform: rotate(${ p => (p.expanded ? '180deg' : '0deg') });
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms !important;
`;

const EmptyIcon = styled('span')`
  background-color: pink;
  width: 1em;
`;


export const DrawerLink = (props) => {
  const { onClick, text, link, icon, children, childrenOpen = false, disabled, setDrawerOpen, isLinkPermitted } = props;
  const [ panelExpanded, setPanelExpanded ] = useState(childrenOpen);

  const handlePress = () => {
    if (link) { setDrawerOpen(false); }
    if (children) { setPanelExpanded(!panelExpanded); }
    if (onClick) { onClick(props); }
  };

  const RenderedIcon = icon
    ? <NavIcon icon={ icon } />
    : <EmptyIcon />;

  const RenderedLink = !disabled && link
    ? Link
    : 'div';

  return (
    <div>
      <RenderedLink href={ link }>
        <ButtonStyle
          type="button"
          color="inherit"
          disabled={ disabled }
          startIcon={ RenderedIcon }
          size="large"
          onClick={ handlePress }
        >
          {text}
          {children && <DropdownIndicator icon="ArrowDropDown" expanded={ panelExpanded ? 1 : 0 } />}
        </ButtonStyle>
      </RenderedLink>
      {children && (
        <HiddenAccordion expanded={ panelExpanded }>
          {children.map((link) => {
            if (isLinkPermitted && !isLinkPermitted(link)) { return undefined; }
            return (
              <DrawerLink
                key={ link.key || link.text + link.link }
                userState={ props?.userState }
                setDrawerOpen={ setDrawerOpen }
                isLinkPermitted={ isLinkPermitted }
                { ...link }
              />
            );
          })}
        </HiddenAccordion>
      )}
    </div>
  );
};
