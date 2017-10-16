import React, { PureComponent } from 'react';
import Countdown from '../../components/Countdown';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import logo from '../../logo.svg';
import s from './Ceremony.scss';

class Ceremony extends PureComponent {
  state = {
    isOpen: false,
  };
  onClick = event => {
    this.setState(
      {
        isOpen: true,
      },
      () => {
        setTimeout(function() {
          window.location.href = '/verkefnid';
        }, 4000);
      }
    );
    event.preventDefault();
    return false;
  };
  render() {
    return (
      <div className={cx(s.root, this.state.isOpen && s.isOpen)}>
        <img src={logo} className={s.logo} />
        <a
          onClick={this.onClick}
          className={s.link}
          href="/open-kjosturett-2017-live"
        >
          Opna Kjósturétt.is
        </a>
      </div>
    );
  }
}

export default withStyles(s)(Ceremony);
