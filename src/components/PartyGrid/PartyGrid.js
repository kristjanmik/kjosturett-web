import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PartyGrid.scss';

const PartyGrid = ({ children }) => <div className={s.grid}>{children}</div>;

export default withStyles(s)(PartyGrid);
