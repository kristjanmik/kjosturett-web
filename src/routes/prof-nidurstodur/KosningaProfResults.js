import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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
  sudvesturkjordaemi: 'Suðvesturkjördæmi'
};

const scoreToFloatingPoint = (score, scalar = 1) =>
  Math.max(1, Math.ceil(score / scalar)) / 100;

class KosningaprofResults extends PureComponent {
  state = {
    open: {},
    kjordaemiFilter: '',
    topFilter: 5,
    candidateCount: 12
  };
  toggle(party) {
    this.setState(({ open }) => ({
      open: {
        ...open,
        [party]: !open[party]
      }
    }));
  }
  render() {
    const { questions, answers, results, parties, url } = this.props;
    const { kjordaemiFilter, topFilter, candidateCount } = this.state;

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
        <div className={s.voteCTA}>
          <p>
            Kosningaprófið er í vinnslu þar sem við bíðum svara frá flokkunum.
          </p>
          <Link
            href="https://2017.kjosturett.is"
            className={s.button}
            target="_blank"
          >
            Skoða kosningaprófið 2017
          </Link>
        </div>
        <div className={s.lead}>
          Niðurstöður úr kosningaprófi <strong>Kjóstu rétt</strong>. Þú getur
          lesið <Link href="/malefni/atvinnumal">stefnumál flokkana</Link> í
          þeim málefnum sem þér þykir mikilvæg.
        </div>

        <p className={s.buttons}>
          <Link className={s.takeTest} href="/kosningaprof">
            Taka kosningaprófið
          </Link>
        </p>

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
            href={`https://twitter.com/home?status=${encodeURIComponent(
              'Mínar niðurstöður úr kosningaprófi kjósturétt.is: ' + url
            )}`}
            target="_blank"
          >
            Deila niðurstöðum á Twitter
          </Link>
        </p>

        <h3>Stjórnmálaflokkar</h3>
        <p className={s.nonLead}>
          Flokkunum er raðað eftir afstöðu þeirra í kosningaprófinu samanborið
          við þín svör. <strong>Smelltu á stjórnmálaflokk</strong> til þess að
          skoða samanburð einstakra spurninga.{' '}
          <i>
            Athygli skal vakin á því að ekki allir flokkar hafa skilað inn
            svörum.
          </i>
        </p>
        {parties
          .filter(party => party.score)
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
                    )})`
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
                  damping: 20
                }}
              >
                {questions
                  .map(question => ({
                    ...question,
                    myAnswer: question.myAnswer || 3,
                    partyAnswer: party.reply[question.id] || 3
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
                      isNaN(aAgree) ||
                      isNaN(bAgree)
                    ) {
                      return -1;
                    }
                    return aAgree - bAgree;
                  })
                  .map(({ id, myAnswer, question, partyAnswer }) => {
                    const iAmIndiffrent = !(myAnswer !== 3 && myAnswer !== 6);
                    const pluralParty = party.name === 'Píratar';
                    const partyIndiffrent = !(
                      partyAnswer !== 3 && partyAnswer !== 6
                    );
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
                            {iAmIndiffrent && 'gagnvart '} þessari staðhæfingu.
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
                              {(partyIndiffrent && pluralParty && 'ir ') || ' '}
                            </strong>{' '}
                            {partyIndiffrent && 'gagnvart '} þessari
                            staðhæfingu.
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
          Svör fólks í framboði fyrir alla flokka í öllum kjördæmum.{' '}
          <i>
            Frambjóðendur fá senda spurningalista þegar Landskjörstjórn hefur
            samþykkt framboðslista flokkanna.
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
              label: constituencies[value]
            }))}
            onChange={val => {
              this.setState({
                kjordaemiFilter: val.map(v => v.value).join(',')
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
                label: 'Allir frambjóðendur'
              },
              { value: 1, label: 'Oddvitar' },
              { value: 2, label: 'Efst 2 á lista' },
              { value: 5, label: 'Efstu 5 á lista' },
              { value: 10, label: 'Efstu 10 á lista' }
            ]}
            onChange={val => {
              this.setState({
                topFilter: val.value
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
                label: 'Sýna 12'
              },
              { value: 24, label: 'Sýna 24' },
              { value: 72, label: 'Sýna 72' },
              { value: 144, label: 'Sýna 144' }
            ]}
            onChange={val => {
              this.setState({
                candidateCount: val.value
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
                  backgroundColor: party && party.color
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
                  style={{ display: candidate.score > 0 ? 'block' : 'none' }}
                >
                  <div
                    className={s.candidateProgress}
                    style={{
                      transform: `scaleX(${scoreToFloatingPoint(
                        candidate.score
                      )})`,
                      background: party && party.color ? party.color : '#555'
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
    );
  }
}

export default withStyles(s, SelectStyles)(KosningaprofResults);
