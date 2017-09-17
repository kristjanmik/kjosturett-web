import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './Header.scss';
import Countdown from '../Countdown';
import logo from './logo_transparent.png';

class Header extends PureComponent {
  render() {
    const { page } = this.props;
    return (
      <div className={s.root}>
        <a href="/">
          <img src={logo} className={s.logo} />
        </a>
        <div className={s.links}>
          <a href="/" className={cx(page === 'forsida' ? s.active : null)}>
            Forsíða
          </a>
          <a
            href="/malefni/velferdarmal"
            className={cx(page === 'malefni' ? s.active : null)}
          >
            Málefnaflokkar
          </a>
          <a
            href="/upplysingar"
            className={cx(page === 'upplysingar' ? s.active : null)}
          >
            Hagnýtar upplýsingar
          </a>
          <a
            href="/verkefnid"
            className={cx(page === 'verkefnid' ? s.active : null)}
          >
            Verkefnið
          </a>
        </div>
        <div className={s.countdown}>
          <Countdown />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Header);
