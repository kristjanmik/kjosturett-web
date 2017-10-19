import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import parties from '../../../data/build/parties.json';
import Link from '../../Link';
import { getAssetUrl } from '../../utils';

import s from './Frontpage.scss';

class FrontPage extends PureComponent {
  render() {
    return (
      <section className={s.parties}>
        {parties.map(party => (
          <Link
            href={`/flokkur/${party.url}`}
            className={s.party}
            key={party.letter}
          >
            <span className={s.imgWrap}>
              <img
                src={getAssetUrl('party-icons', party.url)}
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
          </Link>
        ))}
        <div className={s.emptyParty} />
      </section>
    );
  }
}

export default withStyles(s)(FrontPage);
