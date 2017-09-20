import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Layout.scss';
import Header from '../Header';
import Footer from '../Footer'
import Container from '../Container'

class Layout extends PureComponent {
  render() {
    const { page, children } = this.props;
    return (
      <div className={s.root}>
        <Container>
          <Header page={page} />
          <main className={s.main}>
              {{ ...children }}
          </main>
        </Container>
        <Footer />
      </div>
    );
  }
}

export default withStyles(s)(Layout);
