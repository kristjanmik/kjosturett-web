// @flow

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Container.scss';

const Container = ({ children }) => <div className={s.root}>{children}</div>;

export default withStyles(s)(Container);
