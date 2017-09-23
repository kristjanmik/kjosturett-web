// @flow

import React from 'react';
import styles from './PartyProfile.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { getAssetUrl } from '../../utils';

const Container = ({ name, letter, leader, leaderTitle, url, website }) => (
  <div className={styles.root}>
    <div className={styles.imgWrap}>
      <img
        className={styles.img}
        src={getAssetUrl('formenn', url)}
        alt={`${name}'s ${leaderTitle}: ${leader}`}
      />
    </div>
    <div className={styles.content}>
      <p className={styles.leader}>{leader}</p>
      <p className={styles.leaderTitle}>{leaderTitle}</p>
    </div>
  </div>
);

export default withStyles(styles)(Container);
