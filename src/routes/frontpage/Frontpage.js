import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import parties from '../../lib/data/parties.json';

import s from './Frontpage.scss';

class FrontPage extends PureComponent {
  render() {
    return (
      <div className={s.parties}>
        {parties.map(party => (
          <a
            href={`/flokkur/${party.url}`}
            className={s.party}
            key={party.letter}
          >
            <h3 className={s.letter}>
              <span>x</span>
              {party.letter}
            </h3>
            <img
              src={`https://s3.eu-west-2.amazonaws.com/assets.kjosturett.is/${party.url}.png`}
              className={s.image}
            />
            <h4 className={s.name}>{party.name}</h4>
          </a>
        ))}
      </div>
    );
  }
}

export default withStyles(s)(FrontPage);
