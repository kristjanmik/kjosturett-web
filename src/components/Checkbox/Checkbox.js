// @flow

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Checkbox.scss';

const Checkbox = ({ id, text, onClick, checked, style }) => (
  <div className={s.checkbox}>
    <input
      style={style}
      type="checkbox"
      id={`importan-question-${id}`}
      name={`importan-question-${id}`}
      onClick={onClick}
      checked={checked}
    />
    <label htmlFor={`importan-question-${id}`}>{text}</label>
  </div>
);

export default withStyles(s)(Checkbox);
