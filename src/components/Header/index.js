import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import Countdown from '../Countdown';
import s from './Header.scss';
import logo from '../../logo.svg';

class Header extends PureComponent {
  render() {
    const { page } = this.props;
    return (
      <header className={s.root}>
        <div className={s.leftWrap}>
          <a href="/">
            <img src={logo} className={s.logo} />
          </a>
          <div className={cx(s.countdown)}>
            <Countdown />
          </div>
        </div>
        <div className={s.links}>
          <a
            href="/"
            className={cx(s.politics, page === 'flokkar' ? s.active : null)}
          >
            <span className={s.politicsPrefix}>Stjórnmála</span>flokkar
          </a>
          <a
            href="/malefni/velferdarmal"
            className={cx(page === 'malefni' ? s.active : null)}
          >
            Málefnin
          </a>
        </div>
      </header>
    );
  }
}

export default withStyles(s)(Header);
