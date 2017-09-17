import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Layout.scss';
import Header from '../Header';

class Layout extends PureComponent {
  render() {
    const { page, children } = this.props;
    return (
      <div className={s.root}>
        <Header page={page} />
        <div>{{ ...children }}</div>
      </div>
    );
  }
}

export default withStyles(s)(Layout);
