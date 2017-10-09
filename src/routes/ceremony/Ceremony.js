import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Ceremony.scss';

class Ceremony extends PureComponent {
  render() {
    return (
      <div className={s.root}>
        <a href="/open-kjosturett-2017-live">Opna Kjósturétt.is</a>
      </div>
    );
  }
}

export default withStyles(s)(Ceremony);
