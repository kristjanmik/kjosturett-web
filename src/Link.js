import React from 'react';
import PropTypes from 'prop-types';
import history from './history';

const Link = ({ href, afterClick, ...rest }) => (
  <a
    href={href}
    {...rest}
    onClick={event => {
      if (history == null) {
        return;
      }

      history.push(href);
      if (typeof afterClick === 'function') {
        afterClick(href);
      }
      event.preventDefault();
    }}
  />
);

Link.protoTypes = {
  href: PropTypes.string.isRequired,
  afterClick: PropTypes.func,
};

export default Link;
