import React from 'react';
import App from 'next/app';
import _app from 'modules/_app';


export default class MainApp extends App {
  render() {
    return (
      // eslint-disable-next-line react/jsx-pascal-case
      <_app { ...this.props } />
    );
  }
}
