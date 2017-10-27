import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';
import Img from 'react-image';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './styles.scss';
import answers from '../../../data/poll/answers.json';
import { getAssetUrl } from '../../utils';
import { match } from '../../process-replies';

const valueMap = {
  1: -1,
  2: -0.8,
  3: 0,
  4: 0.8,
  5: 1,
  6: null
};

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
    const { questions, parties } = this.props;
    const { selected } = this.state;

    // const first = partyA;
    // const firstReply = first.reply.split('');
    // const second = partyB;
    // const secondReply = second.reply.split('');

    let filterParties = parties.filter(party => selected.includes(party.name));

    filterParties.sort();

    const replies = filterParties.map(party => party.reply.split(''));

    const minReplies = [];
    const maxReplies = [];
    const replyDistance = [];

    for (let i = 0; i < 38; i++) {
      let max;
      let min;
      replies.forEach(reply => {
        const part = valueMap[reply[i]];

        if (max < part || !max) max = part;
        if (min > part || !min) min = part;
      });

      minReplies.push(min);
      maxReplies.push(max);
      replyDistance.push(Math.abs(min - max));
    }
    // console.log('minReplies', minReplies);
    // console.log('maxReplies', maxReplies);
    // console.log('replyDistance', replyDistance);

    const score = match(minReplies, maxReplies);

    return (
      <div className={s.root}>
        <h1 className={s.heading}>Veldu stjórnmálaflokka til að bera saman</h1>
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
                let out = [...selected];
                if (out.indexOf(party.name) !== -1) {
                  out = out.filter(o => o !== party.name);
                } else {
                  out.push(party.name);
                }

                out.sort();

                this.setState({
                  selected: out
                });
              }}
            >
              <img
                src={getAssetUrl('party-icons', party.url)}
                className={s.selectLogo}
              />
            </div>
          ))}
        </div>
        {filterParties.length === 1 && (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            Veldu einn flokk í viðbót
          </p>
        )}
        {filterParties.length === 2 && (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            Hægt er að bæta við fleiri stjórnmálaflokkum
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
              .map(({ id, question, replies, distance }, qIndex) => {
                return (
                  <div className={s.partyQuestion} key={id}>
                    <h4>
                      <i
                        className={cx(
                          s.dot,
                          !distance !== 0 &&
                            s[
                              `dot${distanceValueMap[
                                Math.round(distance * 100) / 100
                              ]}`
                            ]
                        )}
                      />
                      {question}
                    </h4>
                    {distance === 0 &&
                      filterParties.length === 2 && (
                        <div>Báðir flokkarnir eru sammála fullyrðingunni</div>
                      )}
                    {distance === 0 &&
                      filterParties.length > 2 && (
                        <div>Allir flokkarnir eru sammála fullyrðingunni</div>
                      )}
                    {distance > 0 && (
                      <div>
                        {filterParties.map(party => (
                          <div key={party.name}>
                            <p>
                              <span>{party.name}</span>{' '}
                              {`${party.name === 'Píratar' ? 'eru' : 'er'} `}
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
