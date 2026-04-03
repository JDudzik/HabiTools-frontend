/* Next.js Link docs: https://nextjs.org/docs/api-reference/next/link */
import React from 'react';
import NextLink from 'next/link';
import { styled } from '@mui/material/styles';
import { Link as MuiLink } from '@mui/material';


const UnstyledNextLink = styled(NextLink)`
  color: inherit;
  text-decoration: none;
`;

export const Link = (props) => {
  const {
    children,
    text,
    unstyled,
    href,
    anchorProps = {},
    ...remainingProps
  } = props;

  const isChildComponent =
    typeof children === 'object'
    && React.isValidElement(children)
    && React.Children.only(children);

  return (
    isChildComponent ? (
      <UnstyledNextLink href={ href } { ...anchorProps }>
        {children}
      </UnstyledNextLink>
    ) : (
      <MuiLink color="secondary.light" component="span" { ...remainingProps } >
        <UnstyledNextLink href={ href } { ...anchorProps }>
          {children || text}
        </UnstyledNextLink>
      </MuiLink>
    )
  );
};
