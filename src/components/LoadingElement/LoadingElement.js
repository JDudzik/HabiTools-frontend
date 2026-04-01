import { useState, useEffect } from 'react';

import { Line, SimpleArticle, ListItem } from './loaders';
import {
  CircularProgress,
  NoSsr,
} from '@mui/material';


export const LoadingElement = (props) => {
  const { circle, circular, article, line, listItem, onServer, ...remainingProps } = props;
  const [ visible, setVisible ] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 250);
    return () => clearTimeout(timer);
  }, []);

  const WrappingElement = onServer ? React.Fragment : NoSsr;

  if (circular || circle) {
    return visible ? <WrappingElement><CircularProgress color="secondary" { ...remainingProps } /></WrappingElement> : null;
  }

  if (article) {
    return <WrappingElement><SimpleArticle visible={ visible } { ...remainingProps } /></WrappingElement>;
  }

  if (line) {
    return <WrappingElement><Line visible={ visible } { ...remainingProps } /></WrappingElement>;
  }
  
  if (listItem) {
    return <WrappingElement><ListItem visible={ visible } { ...remainingProps } /></WrappingElement>;
  }

  throw new Error('LoadingElement component requires a selection prop, one of: [circle, circular], article, listItem, line');
};
