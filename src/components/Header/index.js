import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import Container from '../Container';
import Countdown from '../Countdown';
import Link from '../../Link';
import s from './Header.scss';
import logo from '../../logo.svg';

class Header extends PureComponent {
  state = {
    isTop: true,
    isOpen: false
  };
  componentDidMount() {
    window.addEventListener('scroll', this.scroll);
    this.scroll();
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.scroll);
  }
  lastScrollPos = undefined;
  scroll = () => {
    const scroll = window.pageYOffset;
    if (this.lastScrollPos === scroll) {
      return;
    }

    this.lastScrollPos = scroll;
    this.setState({
      isTop: scroll < 50
    });
  };
  toggle(state) {
    const force = state == null;
    this.setState(({ isOpen }) => ({
      isOpen: force ? !isOpen : state
    }));
  }
  renderLinks() {
    const { page } = this.props;

    return [
      <Link
        afterClick={() => this.toggle(false)}
        href="/"
        key="/"
        className={cx(s.politics, page === 'flokkar' ? s.active : null)}
      >
        Stjórnmálaflokkar
      </Link>,
      <Link
        afterClick={() => this.toggle(false)}
        href="/malefni/atvinnumal"
        key="/malefni/atvinnumal"
        className={cx(page === 'malefni' ? s.active : null)}
      >
        Málefni
      </Link>,
      // <Link
      //   afterClick={() => this.toggle(false)}
      //   href="/kjorskra"
      //   key="/kjorskra"
      //   className={cx(page === 'kjorskra' ? s.active : null)}
      // >
      //   Kjörstaðir
      // </Link>,
      // <Link
      //   afterClick={() => this.toggle(false)}
      //   href="/kosningaprof"
      //   key="/kosningaprof"
      //   className={cx(page === 'kosningaprof' ? s.active : null)}
      // >
      //   Kosningapróf
      // </Link>,
      // <Link
      //   afterClick={() => this.toggle(false)}
      //   href="/flokkar/bera-saman"
      //   key="/flokkar/bera-saman"
      //   className={cx(page === 'bera-saman' ? s.active : null)}
      // >
      //   Samanburður
      // </Link>,
      <Link
        afterClick={() => this.toggle(false)}
        className={cx(page === 'verkefnid' ? s.active : null)}
        key="/verkefnid"
        href={'/verkefnid'}
      >
        Um verkefnið
      </Link>,
      <Link
        afterClick={() => this.toggle(false)}
        href="https://2017.kjosturett.is"
        target="_blank"
        key="2017"
      >
        Kosningarnar 2017
      </Link>
    ];
  }
  render() {
    const { isTop, isOpen } = this.state;
    return (
      <div>
        <div className={s.fake} />
        <header className={cx(s.root, !isTop && s.sticky)}>
          <Container>
            <div className={s.wrap}>
              <div className={s.leftWrap}>
                <Link afterClick={() => this.toggle(false)} href="/">
                  <img src={logo} className={s.logo} />
                </Link>
                <div className={cx(s.countdown)}>
                  <Countdown />
                </div>
              </div>
              <nav className={cx(s.desktopNav)}>
                <button
                  className={cx(s.hamburgerBtn, isOpen && s.isOpen)}
                  onClick={() => this.toggle()}
                >
                  <i className={s.hamburger} /> Valmynd
                </button>
                <div className={s.links}>{this.renderLinks()}</div>
              </nav>
            </div>
          </Container>
        </header>
        <nav
          className={cx(s.mobileNav, !isTop && s.sticky, isOpen && s.isOpen)}
        >
          <div className={s.links}>{this.renderLinks()}</div>
        </nav>
      </div>
    );
  }
}

export default withStyles(s)(Header);
