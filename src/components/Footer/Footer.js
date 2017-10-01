// @flow

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './Footer.scss';
import Container from '../Container/Container'

const Footer = () => (
  <footer className={styles.footer}>
    <Container>
      <div className={styles.countdown}>
      </div>
    </Container>
  </footer>
);

export default withStyles(styles)(Footer);
