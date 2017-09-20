// @flow

import React from 'react';
import s from './Container.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

const Container = ({ children }) => (
  <div className={s.root}>
    {children}
  </div>
);

export default withStyles(s)(Container);
