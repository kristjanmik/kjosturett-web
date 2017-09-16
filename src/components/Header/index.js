import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.scss';
import Countdown from '../Countdown';
import logo from './logo_transparent.png';

class Header extends PureComponent {
  render() {
    return (
      <div className={s.root}>
        <a href="/">
          <img src={logo} className={s.logo} />
        </a>
        <div className={s.links}>
          <a href="/">Forsíða</a>
          <a href="/malefni/jafnrettismal">Málefnaflokkar</a>
          <a href="/upplysingar">Hagnýtar upplýsingar</a>
          <a href="/verkefnid">Verkefnið</a>
        </div>
        <div className={s.countdown}>
          <Countdown />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Header);
