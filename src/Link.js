import React from 'react';
import PropTypes from 'prop-types';
import history from './history';

function isMainClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

function isRemote(href) {
  if (history == null || !href) {
    return false;
  }

  const locationHost = history.location.host;
  const match = href.match(/^(?:\w+:)?\/\/([^/\s]+)/);
  return match && match[1] !== locationHost;
}

function isProtocol(href) {
  return href.match(/^(?:tel|mailto):/);
}

const Link = ({ href, afterClick, ...rest }) => (
  <a
    href={href}
    {...(rest.target === '_blank' && {
      rel: 'noreferrer noopener',
    })}
    {...rest}
    onClick={event => {
      if (history == null) {
        return;
      }

      if (isRemote(href)) {
        return;
      }

      if (isProtocol(href)) {
        return;
      }

      if (isModifiedEvent(event) || !isMainClickEvent(event)) {
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
