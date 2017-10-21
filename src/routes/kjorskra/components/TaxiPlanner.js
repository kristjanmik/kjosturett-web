// @flow

import React, { PureComponent, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TaxiPlanner.scss';

class TaxiPlanner extends PureComponent {
  render() {
    return (
      <div className={s.root}>
        <h3>Bombaðu þér á kjörstað með Leigubíl</h3>
        <a href="tel:5885522" className={s.call}>
          Hringja í Hreyfil
        </a>
        <a href="tel:5610000" className={s.call} style={{ marginLeft: '10px' }}>
          Hringja í BSÍ
        </a>
      </div>
    );
  }
}

export default withStyles(s)(TaxiPlanner);
