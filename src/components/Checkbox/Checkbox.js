// @flow

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Checkbox.scss';

const Checkbox = ({ id, text, onClick, checked }) => (
  <div className={s.checkbox}>
    <input
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