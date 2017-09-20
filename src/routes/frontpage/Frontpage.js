import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import parties from '../../lib/data/parties.json';

import s from './Frontpage.scss';

class FrontPage extends PureComponent {
  render() {
    return (
      <section className={s.parties}>
        {parties.map(party => (
          <a
            href={`/flokkur/${party.url}`}
            className={s.party}
            key={party.letter}
          >
            <span className={s.imgWrap}>
              <img
                src={`https://s3.eu-west-2.amazonaws.com/assets.kjosturett.is/${party.url}.png`}
                className={s.image}
              />
            </span>
            <span className={s.info}>
              <h3 className={s.name}>{party.name}</h3>
              <p className={s.leader}>{party.leader}</p>

              <span className={s.letter}>
                <span>x</span>
                {party.letter}
              </span>
            </span>
          </a>
        ))}
      </section>
    );
  }
}

export default withStyles(s)(FrontPage);
