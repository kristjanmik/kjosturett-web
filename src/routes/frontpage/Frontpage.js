import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import parties from '../../../data/build/parties.json';
import Link from '../../Link';

import s from './Frontpage.scss';
import Party from '../../components/Party';
import PartyGrid from '../../components/PartyGrid';

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
              <div className={s.arrow}>→</div>
              <Link href="/malefni/atvinnumal" className={s.button}>
                2. Kynntu þér málefnin
              </Link>
              <div className={s.arrow}>→</div>
              <Link href="/kjorskra" className={s.button}>
                3. Finndu út hvar þú átt að kjósa
              </Link>
            </div>
          </div>
        )}
        <PartyGrid>
          {parties.map(party => (
            <Party
              {...party}
              key={party.letter}
              href={`/flokkur/${party.url}`}
            />
          ))}
        </PartyGrid>
      </div>
    );
  }
}

export default withStyles(s)(FrontPage);
