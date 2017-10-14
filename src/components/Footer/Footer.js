// @flow

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './Footer.scss';
import Link from '../../Link';
import Container from '../Container/Container';

const Footer = () => (
  <footer className={styles.footer}>
    <Container>
      <Link href={'/verkefnid'}>Um verkefnið</Link>
    </Container>
  </footer>
);

export default withStyles(styles)(Footer);
