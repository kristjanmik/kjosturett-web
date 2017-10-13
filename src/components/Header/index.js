import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import Countdown from '../Countdown';
import Link from '../../Link';
import s from './Header.scss';
import logo from '../../logo.svg';

class Header extends PureComponent {
  render() {
    const { page } = this.props;
    return (
      <header className={s.root}>
        <div className={s.leftWrap}>
          <Link href="/">
            <img src={logo} className={s.logo} />
          </Link>
          <div className={cx(s.countdown)}>
            <Countdown />
          </div>
        </div>
        <div className={s.links}>
          <Link
            href="/"
            className={cx(s.politics, page === 'flokkar' ? s.active : null)}
          >
            <span className={s.politicsPrefix}>Stjórnmála</span>flokkar
          </Link>
          <Link
            href="/malefni/velferdarmal"
            className={cx(page === 'malefni' ? s.active : null)}
          >
            Málefnin
          </Link>
        </div>
      </header>
    );
  }
}

export default withStyles(s)(Header);
