import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './KosningaProfResults.scss';
import Link from '../../Link';
import { getAssetUrl } from '../../utils';

class KosningaprofResults extends PureComponent {
  render() {
    const { questions, answers, results, candidates, parties } = this.props;
    return (
      <div className={s.root}>
        <h2>Niðurstöður úr kosningaprófi Kjóstu Rétt</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi sit
          sunt velit rerum distinctio eius minus quis a nihil repudiandae?
        </p>
        <h3>Stjórnmálaflokkar með svipaðr skoðanir og ég</h3>
        {parties.map((party, index) => (
          <Link
            href={`/flokkur/${party.url}`}
            className={s.party}
            key={party.url}
          >
            <img
              src={getAssetUrl('party-icons', party.url)}
              className={s.partyLogo}
            />
            <div className={s.partyName}>{party.name}</div>
            <div className={s.partyPercentage}>
              {(100 * (1 - index / parties.length)).toFixed(2)}%
            </div>
          </Link>
        ))}
        <h3>Frambjóðendur með svipaðr skoðanir og ég</h3>
        <div className={s.candidates}>
          {candidates.slice(0, 12).map((candidate, index) => (
            <div key={candidate.nafn} className={s.candidate}>
              <img className={s.candidateImg} src="notfound.jpg" />
              <div className={s.candidateInfo}>
                <div className={s.candidateName}>{candidate.nafn}</div>
                <div className={s.candidateParty}>
                  {
                    parties.find(party => party.letter === candidate.bokstafur)
                      .name
                  }{' '}
                  (x{candidate.bokstafur})
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(KosningaprofResults);
