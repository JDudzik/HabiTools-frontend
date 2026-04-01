import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';


function ariaLabel(content, label) {  
  if (typeof content === 'number') {
    if (content === 0) {
      return `No ${ label || 'items' }`;
    }
    if (content > 99) {
      return `More than 99 ${ label || 'items' }`;
    }
    return `${ content } ${ label || 'items' }`;
  }
  return label ? `${ label }` : '';
}


export const BadgeIconButton = (props) => {
  const { children, badge, button } = props;
  const { content, label, ...remainingBadge } = badge;

  return (
    <IconButton aria-label={ ariaLabel(content, label) } { ...button }>
      <Badge badgeContent={ content } color="secondary" { ...remainingBadge }>
        {children}
      </Badge>
    </IconButton>
  );
};