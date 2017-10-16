import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Layout.scss';
import Header from '../Header';
import Footer from '../Footer';
import Container from '../Container';

class Layout extends Component {
  render() {
    const { page, title, altTitle, children } = this.props;
    return (
      <div className={s.root}>
        <Header page={page} />
        <main className={s.main}>
          {title && (
            <header className={s.subHeader}>
              <Container>
                <div className={s.subHeaderContent}>
                  <h2 className={s.title}>{title}</h2>
                  <p className={s.altTitle}>{altTitle}</p>
                </div>
              </Container>
            </header>
          )}
          <Container>{children}</Container>
        </main>
      </div>
    );
  }
}

export default withStyles(s)(Layout);
