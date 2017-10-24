import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './styles.scss';
import { Collapse } from 'react-collapse';
import Link from '../../Link';
import { getAssetUrl, candidateImage } from '../../utils';

const scoreToFloatingPoint = (score, scalar = 1) =>
  Math.max(1, Math.ceil(score / scalar)) / 100;

class KosningaprofResults extends PureComponent {
  state = {
    open: {},
  };
  toggle(party) {
    this.setState(({ open }) => ({
      open: {
        ...open,
        [party]: !open[party],
      },
    }));
  }
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
          <div>
            <div
              className={s.party}
              key={party.url}
              role="button"
              onClick={() => this.toggle(party.letter)}
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
            </div>
            <Collapse
              isOpened={this.state.open[party.letter] === true}
              springConfig={{
                stiffness: 100,
                damping: 20,
              }}
            >
              {questions
                .map(question => ({
                  ...question,
                  myAnswer: question.myAnswer || 3,
                  partyAnswer: party.reply[question.id] || 3,
                }))
                .sort((a, b) => {
                  const aAgree = Math.abs(a.myAnswer - a.partyAnswer);
                  const bAgree = Math.abs(b.myAnswer - b.partyAnswer);
                  if (a.myAnswer === 3 || a.myAnswer === 6) {
                    return 1;
                  }
                  if (
                    b.myAnswer === 3 ||
                    b.myAnswer === 6 ||
                    (isNaN(aAgree) || isNaN(bAgree))
                  ) {
                    return -1;
                  }
                  return aAgree - bAgree;
                })
                .map(({ id, myAnswer, question, partyAnswer }) => {
                  const indiffrent = !(myAnswer !== 3 && myAnswer !== 6);
                  const difference = Math.abs(myAnswer - partyAnswer);

                  return (
                    <div className={s.partyQuestion} key={id}>
                      <h4>
                        {!indiffrent && (
                          <i className={cx(s.dot, s[`dot${difference}`])} />
                        )}
                        {question}
                      </h4>

                      {difference === 0 && !indiffrent ? (
                        <div>
                          Við erum{' '}
                          <strong>
                            {answers.textMap[myAnswer].toLowerCase()}
                          </strong>{' '}
                          þessari staðhæfingu.
                        </div>
                      ) : (
                        <div>
                          <div>
                            <strong>{party.name}: </strong>
                            {answers.textMap[partyAnswer]}
                          </div>
                          <div>
                            <strong>Ég: </strong>
                            {answers.textMap[myAnswer] || 'Hlutlaus'}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </Collapse>
          </div>
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
