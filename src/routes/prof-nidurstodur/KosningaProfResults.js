import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './styles.scss';
import Link from '../../Link';
import { getAssetUrl, candidateImage } from '../../utils';

class KosningaprofResults extends PureComponent {
  render() {
    const { questions, answers, results, candidates, parties } = this.props;
    const partyScoreScalar = parties.length ? parties[0].score : 1;
    return (
      <div className={s.root}>
        <h2>Niðurstöður úr kosningaprófi Kjóstu Rétt</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi sit
          sunt velit rerum distinctio eius minus quis a nihil repudiandae?
        </p>
        <h3>Stjórnmálaflokkar með svipaðr skoðanir og ég</h3>
        {parties.filter(party => party.score).map(party => (
          <Link
            href={`/flokkur/${party.url}`}
            className={s.party}
            key={party.url}
          >
            <div
              className={s.partyProgress}
              style={{
                transform: `scaleX(${Math.max(
                  0.01,
                  party.score / partyScoreScalar,
                )})`,
              }}
            />
            <img
              src={getAssetUrl('party-icons', party.url)}
              className={s.partyLogo}
            />
            <div className={s.partyName}>{party.name}</div>
            <div className={s.partyPercentage}>{party.score.toFixed(0)}%</div>
          </Link>
        ))}
        <h3>Frambjóðendur með svipaðr skoðanir og ég</h3>
        <div className={s.candidates}>
          {candidates.slice(0, 12).map(candidate => (
            <div key={candidate.ssn} className={s.candidate}>
              <img
                className={s.candidateImg}
                src={candidateImage(candidate.slug)}
              />
              <div className={s.candidateProgressBar}>
                <div
                  className={s.candidateProgress}
                  style={{
                    transform: `scaleX(${Math.max(
                      0.01,
                      candidate.score / 100,
                    )})`,
                  }}
                />
              </div>
              <div className={s.candidatePercentage}>
                <span>{candidate.score.toFixed(0)}%</span>
              </div>
              <div className={s.candidateInfo}>
                <div className={s.candidateName}>{candidate.name}</div>
                <div className={s.candidateParty}>
                  {
                    parties.find(party => party.letter === candidate.party).name
                  }{' '}
                  (x{candidate.party})
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
