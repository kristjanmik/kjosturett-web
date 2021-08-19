import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import parties from '../../../data/build/parties.json';
import Link from '../../Link';
import { getAssetUrl } from '../../utils';

import s from './Frontpage.scss';

class FrontPage extends PureComponent {
  render() {
    var showElectionDayMessage =
      Date.now() > 1632528000000 && Date.now() < 1632614400000;

    return (
      <div>
        {showElectionDayMessage && (
          <div className={s.voteCTA}>
            <p>Kæri kjósandi, til hamingju með daginn!</p>
            <div className={s.ctaButtons}>
              <Link href="/kosningaprof" className={s.button}>
                1. Taktu kosningaprófið
              </Link>
              <div className={s.arrow}>-></div>
              <Link href="/malefni/atvinnumal" className={s.button}>
                2. Kynntu þér málefnin
              </Link>
              <div className={s.arrow}>-></div>
              <Link href="/kjorskra" className={s.button}>
                3. Finndu út hvar þú átt að kjósa
              </Link>
            </div>
          </div>
        )}
        <div className={s.voteCTA}>
          <p>Vefurinn er í vinnslu fyrir komandi kosningar</p>
          <div className={s.ctaButtons}>
            <Link
              href="/fyrri-kosningar"
              className={s.button}
            >
              Skoða gögn fyrri ára
            </Link>
          </div>
        </div>
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
                  alt={`${party.name}'s logo`}
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
      </div>
    );
  }
}

export default withStyles(s)(FrontPage);
