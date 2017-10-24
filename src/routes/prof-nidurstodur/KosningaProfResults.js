import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './styles.scss';
import Link from '../../Link';
import { getAssetUrl, candidateImage } from '../../utils';

const scoreToFloatingPoint = (score, scalar = 1) =>
  Math.max(1, Math.ceil(score / scalar)) / 100;

class KosningaprofResults extends PureComponent {
  render() {
    const { questions, answers, results, candidates, parties } = this.props;
    const partyScoreScalar = parties.length ? parties[0].score / 100 : 1;
    return (
      <div className={s.root}>
        <p className={s.lead}>
          Niðurstöður úr kosningaprófi <strong>Kjóstu rétt</strong>. Ertu enn
          óviss um hvað skal kjósa? Lestu{' '}
          <Link href="/malefni/atvinnumal">stefnulýsingar flokkana</Link> í þeim
          málefnum sem þér þykja mikilvæg.
        </p>
        <p>
          <Link className={s.takeTest} href="/kosningaprof">
            Taka kosningaprófið!
          </Link>
        </p>

        <h3>Stjórnmálaflokkar</h3>
        <p className={s.nonLead}>
          Flokkunum er raðað eftir hversu samála þið eruð.
        </p>
        {parties.filter(party => party.score).map(party => (
          <Link
            href={`/flokkur/${party.url}`}
            className={s.party}
            key={party.url}
          >
            <div
              className={s.partyProgress}
              style={{
                transform: `scaleX(${scoreToFloatingPoint(
                  party.score,
                  partyScoreScalar,
                )})`,
              }}
            />
            <img
              src={getAssetUrl('party-icons', party.url)}
              className={s.partyLogo}
            />
            <div className={s.partyName}>{party.name}</div>
            <div className={s.partyPercentage}>{Math.ceil(party.score)}%</div>
          </Link>
        ))}
        <h3>Frambjóðendur</h3>
        <p className={s.nonLead}>
          {/* TODO: Filter by kjördæmi */}
          Frambjóðendur allra kjördæma.
        </p>
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
                    transform: `scaleX(${scoreToFloatingPoint(
                      candidate.score,
                    )})`,
                  }}
                />
              </div>
              <div className={s.candidatePercentage}>
                <span>{Math.ceil(candidate.score)}%</span>
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
