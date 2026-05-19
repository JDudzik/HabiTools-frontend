/* Next.js Link docs: https://nextjs.org/docs/api-reference/next/link */
import React from 'react';
import NextLink from 'next/link';
import { styled } from '@mui/material/styles';
import { Link as MuiLink } from '@mui/material';


const UnstyledNextLink = styled(NextLink)`
  color: inherit;
  text-decoration: none;
`;

const isExternalUrl = href => (
  typeof href === 'string'
  && /^(https?:)?\/\//i.test(href)
);

export const Link = (props) => {
  const {
    children,
    text,
    unstyled,
    href,
    anchorProps = {},
    target,
    rel,
    ...remainingProps
  } = props;

  const shouldOpenInNewTab = isExternalUrl(href);
  const linkProps = {
    ...anchorProps,
    target: target ?? anchorProps.target ?? (shouldOpenInNewTab ? '_blank' : undefined),
    rel: rel ?? anchorProps.rel ?? (shouldOpenInNewTab ? 'noopener noreferrer' : undefined),
  };

  const isChildComponent =
    typeof children === 'object'
    && React.isValidElement(children)
    && React.Children.only(children);

  return (
    isChildComponent ? (
      <UnstyledNextLink href={ href } { ...linkProps }>
        {children}
      </UnstyledNextLink>
    ) : (
      <MuiLink color="secondary.light" component="span" { ...remainingProps } >
        <UnstyledNextLink href={ href } { ...linkProps }>
          {children || text}
        </UnstyledNextLink>
      </MuiLink>
    )
  );
};
