import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Layout.scss';
import Header from '../Header';
import Footer from '../Footer';
import Container from '../Container';

class Layout extends PureComponent {
  render() {
    const { page, title, children } = this.props;
    return (
      <div className={s.root}>
        <Container>
          <Header page={page} />
        </Container>
        <main className={s.main}>
          <Container>{children}</Container>
        </main>
        <Footer />
      </div>
    );
  }
}

export default withStyles(s)(Layout);
