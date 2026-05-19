import * as MarkdownToJsx from 'markdown-to-jsx';
import React from 'react';
import { Typography, Box } from '@mui/material';
import { Link } from 'components/Link/Link';
// Docs for markdown-to-jsx: https://www.npmjs.com/package/markdown-to-jsx#optionswrapper


const defaultOptions = {
  wrapper: props => <Box component="div" sx={{ maxWidth: '100%' }} { ...props } />,
  forceWrapper: true,
  overrides: {
    h1: {
      component: props => <Typography variant="h1" color="text.black" { ...props } sx={{ whiteSpace: 'pre-wrap' }} />,
    },
    h2: {
      component: props => <Typography variant="h2" color="text.black" { ...props } sx={{ whiteSpace: 'pre-wrap' }} />,
    },
    h3: {
      component: props => <Typography variant="h3" color="text.black" { ...props } sx={{ whiteSpace: 'pre-wrap' }} />,
    },
    h4: {
      component: props => <Typography variant="h4" color="text.black" { ...props } sx={{ whiteSpace: 'pre-wrap' }} />,
    },
    h5: {
      component: props => <Typography variant="h5" color="text.black" { ...props } sx={{ whiteSpace: 'pre-wrap' }} />,
    },
    h6: {
      component: props => <Typography variant="h6" color="text.black" { ...props } sx={{ whiteSpace: 'pre-wrap' }} />,
    },
    p: {
      component: props => <Typography component="p" color="text.black" { ...props } sx={{ whiteSpace: 'pre-wrap' }} />,
    },
    a: {
      component: props => <Link { ...props } sx={{ whiteSpace: 'pre-wrap' }} color="primary" { ...props } />,
    },
    b: {
      component: props => <Typography component="b" variant="body1" color="text.black" { ...props } sx={{ whiteSpace: 'pre-wrap' }} />,
    },
    span: {
      component: props => <Typography component="span" variant="body1" color="text.black" { ...props } sx={{ whiteSpace: 'pre-wrap' }} />,
    },
    div: {
      component: props => <Box component="div" sx={{ maxWidth: '100%' }} { ...props } />,
    },
    hr: {
      component: props => (
        <Box
          component="hr"
          { ...props }
          sx={{
            border: 'none',
            borderTop: `${ props?.thickness || '2' }px solid`, // Light gray color for a clean look
            borderColor: props?.color || 'text.lightGrey',
            marginY: props?.marginY || '-1rem', // Adds spacing above and below
            width: '100%', // Ensures it spans the container
          }}
        />
      ),
    },
    mark: {
      component: props => (
        <Typography
          component="span"
          variant="body1"
          color="black"
          { ...props }
          sx={{
            backgroundColor: props?.backgroundColor || 'warningSoft.light',
            whiteSpace: 'pre-wrap',
            paddingX: '2px',
            borderRadius: '2px',
          }}
        />
      ),
    },
    code: {
      component: props => (
        <Typography
          component="code"
          color="text.primary"
          { ...props }
          sx={{
            backgroundColor: props?.backgroundColor || 'secondary.100', // Slightly darker for the block
            display: 'inline-block',
            fontFamily: 'monospace',
            fontSize: '0.9rem', // Slightly smaller for inline code
            paddingX: '2px',
            marginY: '2px',
            borderRadius: '2px',
          }}
        />
      ),
    },
    pre: {
      component: props => (
        <Typography
          component="pre"
          color="text.primary"
          { ...props }
          sx={{
            '& code': {
              backgroundColor: props?.backgroundColor || 'secondary.100', // Slightly darker for the block
              padding: 0,
              margin: 0,
            },
            backgroundColor: props?.backgroundColor || 'secondary.100', // Slightly darker for the block
            fontSize: '0.9rem', // Slightly smaller for inline code
            overflowX: 'auto',
            fontFamily: 'monospace',
            borderRadius: '2px',
            paddingX: '4px',
            marginY: '6px',
          }}
        />
      ),
    },
    blockquote: {
      component: props => (
        <Box
          component="blockquote"
          { ...props }
          sx={{
            borderLeft: '3px solid',
            borderColor: props?.borderColor || 'text.lightGrey',
            marginTop: '0.5rem',
            marginBottom: '0.25rem',
            marginX: 0,
            marginLeft: props?.margin || '0.5rem',
            paddingLeft: '1rem',
            paddingY: '0.25rem',
            color: 'text.secondary',
            backgroundColor: props?.backgroundColor || 'secondary.50',
          }}
        />
      ),
    },
    ol: {
      component: props => (
        <Box
          component="ol"
          { ...props }
          sx={{
            margin: 0,
            paddingY: 0,
            paddingLeft: '2.75rem',
            color: props?.color || 'text.black',
            '& ol': {
              paddingLeft: '1.75rem',
            },
          }}
        />
      ),
    },
    ul: {
      component: props => (
        <Box
          component="ul"
          { ...props }
          sx={{
            margin: 0,
            paddingY: 0,
            paddingLeft: '2.75rem',
            color: props?.color || 'text.black',
            '& ul': {
              paddingLeft: '1.75rem',
            },
          }}
        />
      ),
    },
    li: {
      component: props => <li><Typography component="span" variant="body1" color="text.black" { ...props } /></li>,
    },
    table: {
      component: props => (
        <Box
          component="table"
          { ...props }
          sx={{
            width: '100%',
            borderCollapse: 'collapse',
            marginY: '0.25rem',
          }}
        />
      ),
    },
    th: {
      component: props => (
        <Box
          component="th"
          { ...props }
          sx={{
            border: '1px solid',
            borderColor: 'primary.light',
            paddingX: '0.5rem',
            paddingY: '0.25rem',
            textAlign: 'left',
            backgroundColor: 'primary.main',
            color: 'white',
          }}
        />
      ),
    },
    td: {
      component: props => (
        <Box
          component="td"
          { ...props }
          sx={{
            border: '1px solid',
            borderColor: 'text.offWhite',
            paddingX: '0.5rem',
            paddingY: '0.25rem',
            textAlign: 'left',
            verticalAlign: 'top',
            color: 'text.black',
          }}
        />
      ),
    },
    kbd: {
      component: props => (
        <Box
          component="kbd"
          { ...props }
          sx={{
            backgroundColor: '#eeeeee',
            borderRadius: '3px',
            border: '1px solid #b4b4b4',
            boxShadow: '0 1px 1px rgb(0 0 0 / 0.2), 0 2px 0 0 rgb(255 255 255 / 0.7) inset',
            color: '#333333',
            display: 'inline-block',
            fontSize: '0.85em',
            fontWeight: '700',
            lineHeight: '1',
            padding: '2px 4px',
            whiteSpace: 'nowrap',
          }}
        />
      ),
    },
  },

};


const extendOptions = (options) => {
  const { overrides, ...remOptions } = options || {};
  const generatedOptions = { ...defaultOptions };
  
  if (options?.overrides) {
    generatedOptions.overrides = {
      ...generatedOptions.overrides,
      ...overrides,
    };
  }
  return { ...generatedOptions, ...remOptions };
};


const codeBlockRegex = '```[\\s\\S]*?```\\s?';
const inlineCodeRegex = '`[\\s\\S]*?`\\s?';
const preTagRegex = '<pre[\\s\\S]*?<\\/pre>\\s?';
const codeTagRegex = '<code[\\s\\S]*?<\\/code>\\s?';
const blockQuoteRegex = '^>.*(?:\r?\n(?!\n|[^>]))*';

const allMatchers = `(?:${ codeBlockRegex }|${ inlineCodeRegex }|${ preTagRegex }|${ codeTagRegex }|${ blockQuoteRegex })`;
const newlineRegex = '((?:\r?\n){2,})'; // Matches two or more consecutive newlines
const compiler = (text, options) => {
  if (!text) { return null; }

  let formattedText = text;
  if (!options?.skipNewlines) {
    formattedText = text.replace(new RegExp(`${ allMatchers }|${ newlineRegex }`, 'g'), (match, newlines) => {
      if (newlines !== undefined) {
        const count = newlines.split('\n').length - 1;
        if (count) {
          return `\n\n${ '&nbsp;\n'.repeat(count - 1) }\n`;
        }
      }
      return match;
    });
  }
  const extendedOptions = extendOptions(options);
  return MarkdownToJsx.compiler(formattedText, extendedOptions);
};


const Markdown = ({ children, text, options }) => {
  if (!children && !text) { return null; }
  const extendedOptions = extendOptions(options);
  const renderedMarkdown = compiler(children || text, extendedOptions);
  return renderedMarkdown;
};


export const MarkdownMui = {
  RuleType: MarkdownToJsx.RuleType,
  sanitizer: MarkdownToJsx.sanitizer,
  slugify: MarkdownToJsx.slugify,
  Markdown,
  compiler,
};