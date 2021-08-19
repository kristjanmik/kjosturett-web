// @flow

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './Footer.scss';
import Link from '../../Link';
import Container from '../Container/Container';
import logo from '../../logo.svg';

const Footer = () => (
  <footer className={styles.footer}>
    <Container>
      <div className={styles.wrap}>
        <Link href="/">
          <img className={styles.logo} src={logo} alt="Logo" />
        </Link>
        <nav className={styles.nav}>
          <Link className={styles.link} href={'/verkefnid'}>
            Um verkefnið
          </Link>
          <Link className={styles.link} href={'/fyrri-kosningar'}>
            Fyrri kosningar
          </Link>
          <Link
            className={styles.link}
            target="_blank"
            href="https://github.com/kristjanmik/kjosturett-web"
          >
            GitHub
          </Link>
        </nav>
      </div>
    </Container>
  </footer>
);

export default withStyles(styles)(Footer);
