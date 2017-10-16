import React, { PureComponent } from 'react';
import Countdown from '../../components/Countdown';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import logo from '../../logo.svg';
import s from './Ceremony.scss';

class Ceremony extends PureComponent {
  state = {
    isOpen: false
  };
  onClick = event => {
    setTimeout(() => {
      window.location = 'https://kjosturett.is';
    }, 4000);

    this.setState({
      isOpen: true
    });

    event.preventDefault();
    return false;
  };
  render() {
    return (
      <div className={cx(s.root, this.state.isOpen && s.isOpen)}>
        <img src={logo} className={s.logo} />
        <p>...er nú opin öllum!</p>
        <a
          onClick={this.onClick}
          className={s.link}
          href="/open-kjosturett-2017-live"
        >
          Opna Kjósturétt.is
          <span className={s.linkBot} />
          <span className={s.linkTop} />
        </a>
      </div>
    );
  }
}

export default withStyles(s)(Ceremony);
