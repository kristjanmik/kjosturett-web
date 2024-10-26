import React, { PureComponent } from 'react';
import cx from 'classnames';
import { Collapse } from 'react-collapse';
import Img from 'react-image';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './styles.scss';
import Select from 'react-select';
import Link from '../../Link';
import transparent from './transparent.png';
import { getAssetUrl, candidateImage } from '../../utils';

import SelectStyles from '../../../node_modules/react-select/dist/react-select.css';

const constituencies = {
  'reykjavik-sudur': 'Reykjavíkurkjördæmi suður',
  'reykjavik-nordur': 'Reykjavíkurkjördæmi norður',
  nordvesturkjordaemi: 'Norðvesturkjördæmi',
  nordausturkjordaemi: 'Norðausturkjördæmi',
  sudurkjordaemi: 'Suðurkjördæmi',
  sudvesturkjordaemi: 'Suðvesturkjördæmi',
};

const scoreToFloatingPoint = (score, scalar = 1) =>
  Math.max(1, Math.ceil(score / scalar)) / 100;

function pluralize(count, singular, plural, zero = '') {
  if (count === 0 && zero) {
    return zero;
  }
  return count > 1 ? plural : singular;
}

class KosningaprofResults extends PureComponent {
  state = {
    open: {},
    kjordaemiFilter: '',
    topFilter: 5,
    candidateCount: 12,
  };
  toggle(party) {
    this.setState(({ open }) => ({
      open: {
        ...open,
        [party]: !open[party],
      },
    }));
  }

  renderLink(href, title, extraProps) {
    const { isEmbedded } = this.props;
    return (
      <Link href={(isEmbedded ? '/embed' : '') + href} {...extraProps}>
        {title}
      </Link>
    );
  }

  renderIntro() {
    if (this.props.isEmbedded) {
      return (
        <div>
          <p className={s.lead}>Niðurstöður úr kosningaprófi</p>
          <p style={{ textAlign: 'center' }}>
            Þú getur nálgast ýtarefni um flokkana og frambjóðendur á{' '}
            <strong>
              <a href="https://kjosturett.is/" target="_blank">
                www.kjosturett.is
              </a>
            </strong>
          </p>
        </div>
      );
    }

    const { ogImage, url } = this.props;

    return (
      <div>
        <p className={s.lead}>
          Niðurstöður úr kosningaprófi <strong>Kjóstu rétt</strong>. Þú getur
          lesið {this.renderLink('/malefni/atvinnumal', 'stefnumál flokkana')} í
          þeim málefnum sem þér þykir mikilvæg.
        </p>

        <p className={s.buttons}>
          {this.renderLink('/kosningaprof', 'Taka kosningaprófið', {
            className: s.takeTest,
          })}
        </p>

        {ogImage && <img src={ogImage} className={s.resultImage} />}

        <p className={s.buttons}>
          <Link
            className={s.shareButton}
            style={{ background: '#4760a5' }}
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              url
            )}`}
            target="_blank"
          >
            Deila niðurstöðum á Facebook
          </Link>
          <Link
            className={s.shareButton}
            style={{ background: '#1da0f2', marginLeft: '15px' }}
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              'Mínar niðurstöður úr kosningaprófi Kjóstu rétt: '
            )}&url=${encodeURIComponent(url)}&hashtags=kosningar`}
            target="_blank"
          >
            Deila niðurstöðum á Twitter
          </Link>
        </p>
      </div>
    );
  }

  render() {
    const { isEmbedded, questions, answers, parties } = this.props;
    const { kjordaemiFilter, topFilter, candidateCount } = this.state;
    const answeredQuestions = questions.filter(
      ({ myAnswer }) => myAnswer !== null && myAnswer !== 6
    );
    const candidates = this.props.candidates
      .filter(c => {
        if (
          kjordaemiFilter !== '' &&
          kjordaemiFilter.indexOf(c.constituency) === -1
        ) {
          return false;
        }

        if (c.seat > topFilter) {
          return false;
        }

        return true;
      })
      .slice(0, candidateCount);

    const partyScoreScalar = parties.length ? parties[0].score / 100 : 1;
    return (
      <div className={s.root}>
        {this.renderIntro()}

        <h3 className={s.partiesHeader}>Stjórnmálaflokkar</h3>
        <p className={s.nonLead}>
          Flokkunum er raðað eftir afstöðu þeirra í kosningaprófinu samanborið
          við þín svör. <strong>Smelltu á stjórnmálaflokk</strong> til þess að
          skoða samanburð einstakra spurninga.{' '}
        </p>

        {answeredQuestions.length / questions.length < 0.5 && (
          <p className={s.nonLead}>
            Einungis {answeredQuestions.length}{' '}
            {pluralize(answeredQuestions.length, 'spurningu', 'spurningum')} var
            svarað og því gætu niðurstöðurnar ekki veitt fullkomna mynd. Því
            fleiri spurningum sem þú svarar, því nákvæmari niðurstöður færðu.
          </p>
        )}

        {isEmbedded && (
          <p className={s.nonLead}>
            {this.renderLink('/kosningaprof', 'Taka prófið aftur')}
          </p>
        )}

        {parties
          .filter(party => !isNaN(party.score))
          .map(party => (
            <div key={party.letter}>
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
                      partyScoreScalar
                    )})`,
                  }}
                />
                <img
                  src={getAssetUrl('party-icons', party.url)}
                  className={s.partyLogo}
                />
                <div className={s.partyName}>{party.name}</div>
                <div className={s.partyPercentage}>
                  {Math.ceil(party.score)}%
                </div>
              </div>
              <Collapse
                isOpened={this.state.open[party.letter] === true}
                springConfig={{
                  stiffness: 100,
                  damping: 20,
                }}
              >
                <div className={s.partyQuestions}>
                  {answeredQuestions
                    .map(question => ({
                      ...question,
                      myAnswer: question.myAnswer,
                      partyAnswer: party.reply[question.id],
                    }))
                    .sort((a, b) => {
                      const aAgree = Math.abs(a.myAnswer - a.partyAnswer);
                      const bAgree = Math.abs(b.myAnswer - b.partyAnswer);
                      console.log('a', a.myAnswer, b.myAnswer);
                      if (a.myAnswer === 6) {
                        return 1;
                      }
                      if (b.myAnswer === 6 || isNaN(aAgree) || isNaN(bAgree)) {
                        return -1;
                      }
                      return aAgree - bAgree;
                    })
                    .map(({ id, myAnswer, question, partyAnswer }) => {
                      const iAmIndiffrent = myAnswer === 6;
                      const pluralParty = party.name === 'Píratar';
                      const partyIndiffrent = partyAnswer === 6;
                      const difference = Math.abs(myAnswer - partyAnswer);

                      return (
                        <div className={s.partyQuestion} key={id}>
                          <h4>
                            <i
                              className={cx(
                                s.dot,
                                !iAmIndiffrent && s[`dot${difference}`]
                              )}
                            />
                            {question}
                          </h4>

                          {difference === 0 ? (
                            <div>
                              Bæði ég og {party.name} erum{' '}
                              <strong>
                                {answers.textMap[myAnswer].toLowerCase()}
                              </strong>{' '}
                              {iAmIndiffrent && 'gagnvart '} þessari
                              staðhæfingu.
                            </div>
                          ) : (
                            <div>
                              Ég er{' '}
                              <strong>
                                {(
                                  answers.textMap[myAnswer] || 'hlutlaus'
                                ).toLowerCase()}
                              </strong>{' '}
                              en {party.name} {pluralParty ? 'eru ' : 'er '}
                              <strong>
                                {(
                                  answers.textMap[partyAnswer] || 'hlutlaus'
                                ).toLowerCase()}
                                {(partyIndiffrent && pluralParty && 'ir ') ||
                                  ' '}
                              </strong>{' '}
                              {partyIndiffrent && 'gagnvart '} þessari
                              staðhæfingu.
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </Collapse>
            </div>
          ))}
        {/* Not included for the 2021 election */}
        {false && (
          <div>
            <h3>Frambjóðendur</h3>
            <p className={s.nonLead}>
              Svör fólks í framboði fyrir alla flokka í öllum kjördæmum.{' '}
              <i>
                Frambjóðendur fá senda spurningalista þegar Landskjörstjórn
                hefur samþykkt framboðslista flokkanna.
              </i>
            </p>
            <div className={s.filters}>
              <Select
                multi={true}
                name="kjordaemi"
                value={kjordaemiFilter}
                placeholder="Kjördæmi"
                className={s.kjordaemiFilter}
                options={Object.keys(constituencies).map(value => ({
                  value,
                  label: constituencies[value],
                }))}
                onChange={val => {
                  this.setState({
                    kjordaemiFilter: val.map(v => v.value).join(','),
                  });
                }}
              />
              <Select
                name="top"
                value={topFilter}
                className={s.topFilter}
                clearable={false}
                options={[
                  {
                    value: 30,
                    label: 'Allir frambjóðendur',
                  },
                  { value: 1, label: 'Oddvitar' },
                  { value: 2, label: 'Efst 2 á lista' },
                  { value: 5, label: 'Efstu 5 á lista' },
                  { value: 10, label: 'Efstu 10 á lista' },
                ]}
                onChange={val => {
                  this.setState({
                    topFilter: val.value,
                  });
                }}
              />
              <Select
                name="show"
                value={candidateCount}
                className={s.showCount}
                clearable={false}
                options={[
                  {
                    value: 12,
                    label: 'Sýna 12',
                  },
                  { value: 24, label: 'Sýna 24' },
                  { value: 72, label: 'Sýna 72' },
                  { value: 144, label: 'Sýna 144' },
                ]}
                onChange={val => {
                  this.setState({
                    candidateCount: val.value,
                  });
                }}
              />
            </div>
            <div className={s.candidates}>
              {candidates.map(candidate => {
                const party = parties.find(x => x.letter === candidate.party);
                return (
                  <div
                    key={candidate.slug}
                    className={s.candidate}
                    style={{
                      backgroundColor: party && party.color,
                    }}
                  >
                    {candidate.hasImage && (
                      <Img
                        className={s.candidateImg}
                        src={[candidateImage(candidate.slug), transparent]}
                      />
                    )}
                    {!candidate.hasImage && (
                      <Img className={s.candidateImg} src={[transparent]} />
                    )}
                    <div
                      className={s.candidateProgressBar}
                      style={{
                        display: candidate.score > 0 ? 'block' : 'none',
                      }}
                    >
                      <div
                        className={s.candidateProgress}
                        style={{
                          transform: `scaleX(${scoreToFloatingPoint(
                            candidate.score
                          )})`,
                          background:
                            party && party.color ? party.color : '#555',
                        }}
                      />
                    </div>
                    {candidate.score > 0 && (
                      <div className={s.candidatePercentage}>
                        <span>{Math.ceil(candidate.score)}%</span>
                      </div>
                    )}
                    {candidate.score === 0 && (
                      <div className={s.candidateNoResponse}>
                        <span>Frambjóðandi hefur ekki svarað</span>
                      </div>
                    )}
                    <div className={s.candidateInfo}>
                      <div className={s.candidateName}>{candidate.name}</div>
                      {party && (
                        <div className={s.candidateParty}>
                          {party.name} (x{candidate.party})
                        </div>
                      )}
                      <div className={s.candidateConstituency}>
                        {candidate.seat}. sæti
                        <br />
                        {constituencies[candidate.constituency]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(s, SelectStyles)(KosningaprofResults);
