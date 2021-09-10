import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';
import Img from 'react-image';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './styles.scss';
import history from '../../history';
import answers from '../../../data/poll/answers.json';
import { getAssetUrl } from '../../utils';
import Link from '../../Link';

const distanceValueMap = {
  '0': 0,
  '0.2': 1,
  '0.8': 1,
  '1': 2,
  '1.6': 4,
  '1.8': 4,
  '2': 4
};

class CompareParties extends PureComponent {
  state = {
    selected: []
  };
  render() {
    const {
      questions,
      parties,
      filterParties,
      replies,
      replyDistance,
      score,
      url
    } = this.props;

    return (
      <div className={s.root}>
        <h1 className={s.heading}>Veldu stjórnmálaflokka til að bera saman</h1>
        {filterParties.length === 2 && (
          <p
            style={{
              textAlign: 'center',
              marginTop: '20px',
              fontSize: '1.2rem',
              maxWidth: '500px',
              margin: 'auto'
            }}
          >
            <b>
              Hægt er að bæta við fleiri en tveimur stjórnmálaflokkum til að sjá
              samstöðu margra flokka.
            </b>
            <i>
              Athygli skal vakin á því að flokkar eru einungis birtir ef þeir
              hafa skilað svörum við kosningaprófinu
            </i>
          </p>
        )}
        <div className={s.chooseContainer}>
          {parties.map(party => (
            <div
              key={party.letter}
              className={cx(
                s.selectContainer,
                filterParties.filter(p => p.name === party.name)[0]
                  ? s.selected
                  : null
              )}
              onClick={() => {
                let out = filterParties.map(p => p.letter);
                if (out.indexOf(party.letter) !== -1) {
                  out = out.filter(o => o !== party.letter);
                } else {
                  out.push(party.letter);
                }

                history.push(`/flokkar/bera-saman/${out.join('')}`);
              }}
            >
              <div>
                <img
                  src={getAssetUrl('party-icons', party.url)}
                  className={s.selectLogo}
                />
              </div>
              <p>
                <b>{party.letter}</b> - {party.name}
              </p>
            </div>
          ))}
        </div>
        {filterParties.length === 1 && (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            Veldu einn flokk í viðbót
          </p>
        )}

        {filterParties.length > 1 && (
          <p className={s.buttons}>
            <Link
              className={s.shareButton}
              style={{ background: '#4760a5' }}
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                'https://kjosturett.is' + url
              )}`}
              target="_blank"
            >
              {`Deila ${filterParties.map(p => p.letter).join('')} á Facebook`}
            </Link>
            <Link
              className={s.shareButton}
              style={{ background: '#1da0f2', marginLeft: '15px' }}
              href={`https://twitter.com/home?status=${encodeURIComponent(
                'Samanburður flokka á kjósturétt.is: https://kjosturett.is' +
                  url
              )}`}
              target="_blank"
            >
              {`Deila ${filterParties.map(p => p.letter).join('')} á Twitter`}
            </Link>
          </p>
        )}
        {filterParties.length > 1 && (
          <div className={s.scoreContainer}>{`Flokkarnir eiga ${score.toFixed(
            0
          )}% samleið`}</div>
        )}

        {filterParties.length > 1 && (
          <p>Niðurstöður eru reiknaðar út frá eftirfarandi fullyrðingum:</p>
        )}
        {filterParties.length > 1 && (
          <div className={s.questionsContainer}>
            {questions
              .map(question => ({
                ...question,
                replies: filterParties.map(p => p.reply[question.id - 1]),
                distance: replyDistance[question.id - 1]
              }))
              .sort((a, b) => {
                if (a.distance > b.distance) return 1;
                if (a.distance < b.distance) return -1;
                return 0;
              })
              .map(({ id, question, replies, distance }) => {
                return (
                  <div className={s.partyQuestion} key={id}>
                    <h4>
                      <i
                        className={cx(
                          s.dot,
                          !distance !== 0 &&
                            s[
                              `dot${
                                distanceValueMap[
                                  Math.round(distance * 100) / 100
                                ]
                              }`
                            ]
                        )}
                      />
                      {question}
                    </h4>
                    {distance === 0 && filterParties.length === 2 && (
                      <div>
                        {`Báðir flokkarnir eru ${answers.textMap[
                          replies[0]
                        ].toLowerCase()}${
                          ['3', '6'].includes(replies[0]) ? 'ir gagnvart' : ''
                        } fullyrðingunni`}
                      </div>
                    )}
                    {distance === 0 && filterParties.length > 2 && (
                      <div>
                        {`Allir flokkarnir eru ${answers.textMap[
                          replies[0]
                        ].toLowerCase()}${
                          ['3', '6'].includes(replies[0]) ? 'ir gagnvart' : ''
                        } fullyrðingunni`}
                      </div>
                    )}
                    {distance > 0 && (
                      <div>
                        {filterParties.map(party => (
                          <div key={party.name}>
                            <p>
                              <span>{party.name}</span>{' '}
                              {`${
                                ['Píratar', 'Vinstri Græn'].includes(party.name)
                                  ? 'eru'
                                  : 'er'
                              } `}
                              <b>
                                {answers.textMap[
                                  party.reply[id - 1]
                                ].toLowerCase()}
                              </b>
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(s)(CompareParties);
